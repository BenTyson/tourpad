import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If user doesn't have a subscription, return basic info
    if (!user.subscription) {
      return NextResponse.json({
        subscription: {
          status: 'NONE',
          currentPeriodEnd: null,
          amount: 0,
          interval: null
        },
        paymentMethod: null,
        billing: {
          nextPaymentDate: null,
          lastPaymentDate: user.payments[0]?.createdAt || null,
          totalPaid: user.payments
            .filter(p => p.status === 'SUCCEEDED')
            .reduce((sum, p) => sum + p.amount, 0)
        },
        recentPayments: user.payments.map(p => ({
          id: p.id,
          amount: p.amount,
          status: p.status,
          description: p.description,
          createdAt: p.createdAt
        }))
      });
    }

    // Get detailed Stripe subscription info
    let stripeSubscription = null;
    let paymentMethodInfo = null;

    if (user.subscription.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(
          user.subscription.stripeSubscriptionId,
          {
            expand: ['default_payment_method', 'customer']
          }
        );

        // Get payment method details
        if (stripeSubscription.default_payment_method) {
          const paymentMethod = stripeSubscription.default_payment_method as Stripe.PaymentMethod;
          if (paymentMethod.card) {
            paymentMethodInfo = {
              brand: paymentMethod.card.brand,
              last4: paymentMethod.card.last4,
              expiryMonth: paymentMethod.card.exp_month,
              expiryYear: paymentMethod.card.exp_year
            };
          }
        }
      } catch (stripeError) {
        console.error('Error fetching Stripe subscription:', stripeError);
      }
    }

    // Calculate grace period end (7 days after period end for failed payments)
    let gracePeriodEnd = null;
    if (user.subscription.status === 'EXPIRED') {
      const gracePeriodDays = 7;
      gracePeriodEnd = new Date(user.subscription.currentPeriodEnd);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriodDays);
    }

    return NextResponse.json({
      subscription: {
        status: user.subscription.status,
        currentPeriodStart: user.subscription.currentPeriodStart,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        amount: user.subscription.amount,
        interval: user.subscription.interval,
        cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
        gracePeriodEnd
      },
      paymentMethod: paymentMethodInfo,
      billing: {
        nextPaymentDate: user.subscription.cancelAtPeriodEnd ? null : user.subscription.currentPeriodEnd,
        lastPaymentDate: user.payments[0]?.createdAt || null,
        totalPaid: user.payments
          .filter(p => p.status === 'SUCCEEDED')
          .reduce((sum, p) => sum + p.amount, 0)
      },
      recentPayments: user.payments.map(p => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        description: p.description,
        createdAt: p.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}