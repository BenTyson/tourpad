import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const prisma = new PrismaClient();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('Received webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        
        // Get the customer and session details
        const customerId = session.customer as string;
        const paymentIntentId = session.payment_intent as string;
        
        // Find user by email (from session customer_details)
        const customerEmail = session.customer_details?.email;
        if (!customerEmail) {
          console.error('No customer email in session');
          break;
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: customerEmail }
        });

        if (!user) {
          console.error('User not found for email:', customerEmail);
          break;
        }

        // Create payment record
        await prisma.payment.create({
          data: {
            userId: user.id,
            stripePaymentId: paymentIntentId || session.id,
            stripeCustomerId: customerId,
            amount: session.amount_total || 40000, // $400 in cents
            currency: 'usd',
            status: 'SUCCEEDED',
            description: 'Artist Annual Membership',
            paymentType: 'ARTIST_ANNUAL'
          }
        });

        // Create or update subscription - for both subscription and one-time payments
        if (session.subscription) {
          // Handle actual Stripe subscriptions
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          await prisma.subscription.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              stripeSubscriptionId: subscription.id,
              stripeCustomerId: customerId,
              stripePriceId: subscription.items.data[0].price.id,
              status: 'ACTIVE',
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              amount: subscription.items.data[0].price.unit_amount || 40000,
              interval: subscription.items.data[0].price.recurring?.interval || 'year'
            },
            update: {
              status: 'ACTIVE',
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000)
            }
          });
        } else {
          // Handle one-time payments by creating a manual subscription record
          const now = new Date();
          const oneYearFromNow = new Date();
          oneYearFromNow.setFullYear(now.getFullYear() + 1);

          await prisma.subscription.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              stripeCustomerId: customerId,
              status: 'ACTIVE',
              currentPeriodStart: now,
              currentPeriodEnd: oneYearFromNow,
              amount: session.amount_total || 40000,
              interval: 'year'
            },
            update: {
              status: 'ACTIVE',
              currentPeriodStart: now,
              currentPeriodEnd: oneYearFromNow
            }
          });
        }

        // Update user status to ACTIVE (for artists who were APPROVED)
        await prisma.user.update({
          where: { id: user.id },
          data: { status: 'ACTIVE' }
        });

        // Update Stripe customer ID if not set
        if (!user.stripeCustomerId) {
          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customerId }
          });
        }

        console.log('✅ Payment processed successfully for user:', user.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);
        
        // Handle recurring payments
        const customerId = invoice.customer as string;
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId }
        });

        if (user) {
          // Create payment record for renewal
          await prisma.payment.create({
            data: {
              userId: user.id,
              stripePaymentId: invoice.payment_intent as string || invoice.id,
              stripeCustomerId: customerId,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: 'SUCCEEDED',
              description: 'Subscription Renewal',
              paymentType: 'ARTIST_ANNUAL'
            }
          });

          // Ensure user stays active
          await prisma.user.update({
            where: { id: user.id },
            data: { status: 'ACTIVE' }
          });

          console.log('✅ Renewal payment processed for user:', user.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed:', invoice.id);
        
        const customerId = invoice.customer as string;
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId }
        });

        if (user) {
          // Create failed payment record
          await prisma.payment.create({
            data: {
              userId: user.id,
              stripePaymentId: invoice.payment_intent as string || invoice.id,
              stripeCustomerId: customerId,
              amount: invoice.amount_due,
              currency: invoice.currency,
              status: 'FAILED',
              description: 'Failed Payment',
              paymentType: 'ARTIST_ANNUAL'
            }
          });

          // Update subscription status
          if (invoice.subscription) {
            await prisma.subscription.update({
              where: { stripeSubscriptionId: invoice.subscription as string },
              data: { status: 'PAST_DUE' }
            });
          }

          console.log('⚠️ Payment failed for user:', user.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', subscription.id);
        
        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'CANCELED' }
        });

        // Set user to inactive after grace period
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: subscription.customer as string }
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { status: 'INACTIVE' }
          });
          console.log('❌ User deactivated due to subscription cancellation:', user.id);
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}