import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true }
    });

    if (!user || !user.subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    if (!user.subscription.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No Stripe subscription found' }, { status: 404 });
    }

    // Cancel the subscription at period end in Stripe
    const stripeSubscription = await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Update our database
    await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      message: 'Subscription will be canceled at the end of the current period',
      subscription: {
        cancelAtPeriodEnd: true,
        currentPeriodEnd: (stripeSubscription as any).current_period_end * 1000 // Convert to milliseconds
      }
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}