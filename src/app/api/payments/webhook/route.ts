import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature, getSubscriptionStatus } from '@/lib/stripe';
import { db } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId;
    if (!userId) {
      console.error('No userId in checkout session metadata');
      return;
    }

    // TODO: Update user payment status in database
    // await db.users.update({
    //   where: { id: userId },
    //   data: {
    //     stripeCustomerId: session.customer as string,
    //     paymentStatus: 'paid',
    //     subscriptionId: session.subscription as string
    //   }
    // });

    console.log(`Checkout completed for user ${userId}`);
  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      console.error('No userId in subscription metadata');
      return;
    }

    const status = getSubscriptionStatus(subscription);

    // TODO: Update user subscription in database
    // await db.artistProfiles.update({
    //   where: { userId },
    //   data: {
    //     subscriptionId: subscription.id,
    //     subscriptionStatus: subscription.status,
    //     subscriptionExpiry: status.currentPeriodEnd,
    //     paymentStatus: status.isActive ? 'paid' : 'pending'
    //   }
    // });

    console.log(`Subscription created for user ${userId}`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      console.error('No userId in subscription metadata');
      return;
    }

    const status = getSubscriptionStatus(subscription);

    // TODO: Update user subscription status
    // await db.artistProfiles.update({
    //   where: { userId },
    //   data: {
    //     subscriptionStatus: subscription.status,
    //     subscriptionExpiry: status.currentPeriodEnd,
    //     paymentStatus: status.isActive ? 'paid' : 
    //                   status.isPastDue ? 'failed' : 
    //                   status.isCanceled ? 'cancelled' : 'pending'
    //   }
    // });

    // Update user account status based on subscription
    // const userStatus = status.isActive ? 'approved' : 
    //                   status.isExpired ? 'suspended' : 'pending';
    
    // await db.users.update({
    //   where: { id: userId },
    //   data: { status: userStatus }
    // });

    console.log(`Subscription updated for user ${userId}: ${subscription.status}`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

// Handle subscription deletion/cancellation
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      console.error('No userId in subscription metadata');
      return;
    }

    // TODO: Update user status to suspended
    // await db.users.update({
    //   where: { id: userId },
    //   data: { status: 'suspended' }
    // });

    // await db.artistProfiles.update({
    //   where: { userId },
    //   data: {
    //     subscriptionStatus: 'canceled',
    //     paymentStatus: 'cancelled'
    //   }
    // });

    console.log(`Subscription deleted for user ${userId}`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    if (!subscriptionId) return;

    // TODO: Update payment records
    // const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    // const userId = subscription.metadata?.userId;
    
    // if (userId) {
    //   await db.artistProfiles.update({
    //     where: { userId },
    //     data: {
    //       paymentStatus: 'paid',
    //       lastPaymentDate: new Date()
    //     }
    //   });
    // }

    console.log(`Payment succeeded for subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    if (!subscriptionId) return;

    // TODO: Update payment status and send notification
    // const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    // const userId = subscription.metadata?.userId;
    
    // if (userId) {
    //   await db.artistProfiles.update({
    //     where: { userId },
    //     data: {
    //       paymentStatus: 'failed'
    //     }
    //   });
    //   
    //   // TODO: Send email notification about failed payment
    // }

    console.log(`Payment failed for subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}
