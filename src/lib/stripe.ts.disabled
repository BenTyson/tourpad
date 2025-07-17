// Stripe payment processing utilities
import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Client-side Stripe instance
let stripePromise: Promise<Stripe | null>;
if (typeof window !== 'undefined') {
  stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
}

export { stripe };
export const getStripe = () => stripePromise;

// Artist subscription pricing
export const ARTIST_SUBSCRIPTION = {
  price: 40000, // $400.00 in cents
  currency: 'usd',
  interval: 'year' as const,
  description: 'Annual TourPad Artist Membership'
};

// Create customer
export async function createCustomer({
  email,
  name,
  metadata = {}
}: {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    });
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create customer');
  }
}

// Create subscription
export async function createSubscription({
  customerId,
  priceId,
  metadata = {}
}: {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata
    });
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error('Failed to create subscription');
  }
}

// Create payment intent for one-time payment
export async function createPaymentIntent({
  amount,
  currency = 'usd',
  customerId,
  metadata = {}
}: {
  amount: number;
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
}

// Create checkout session
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata = {}
}: {
  customerId?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
    });
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

// Retrieve subscription
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw new Error('Failed to retrieve subscription');
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

// Update subscription
export async function updateSubscription({
  subscriptionId,
  priceId,
  metadata
}: {
  subscriptionId: string;
  priceId?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Subscription> {
  try {
    const updateParams: Stripe.SubscriptionUpdateParams = {};
    
    if (priceId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      updateParams.items = [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ];
    }
    
    if (metadata) {
      updateParams.metadata = metadata;
    }
    
    const subscription = await stripe.subscriptions.update(subscriptionId, updateParams);
    return subscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription');
  }
}

// Create product and price (for setup)
export async function createArtistSubscriptionProduct(): Promise<{ product: Stripe.Product; price: Stripe.Price }> {
  try {
    // Create product
    const product = await stripe.products.create({
      name: 'TourPad Artist Membership',
      description: 'Annual membership for artists to access the TourPad platform',
      metadata: {
        type: 'artist_subscription'
      }
    });
    
    // Create price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: ARTIST_SUBSCRIPTION.price,
      currency: ARTIST_SUBSCRIPTION.currency,
      recurring: {
        interval: ARTIST_SUBSCRIPTION.interval,
      },
      metadata: {
        type: 'artist_subscription'
      }
    });
    
    return { product, price };
  } catch (error) {
    console.error('Error creating product and price:', error);
    throw new Error('Failed to create product and price');
  }
}

// Webhook signature verification
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }
    
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw new Error('Invalid webhook signature');
  }
}

// Get customer by email
export async function getCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1
    });
    
    return customers.data.length > 0 ? customers.data[0] : null;
  } catch (error) {
    console.error('Error finding customer by email:', error);
    return null;
  }
}

// Check subscription status
export function getSubscriptionStatus(subscription: Stripe.Subscription): {
  isActive: boolean;
  isPending: boolean;
  isPastDue: boolean;
  isCanceled: boolean;
  isExpired: boolean;
  currentPeriodEnd: Date;
} {
  const status = subscription.status;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  
  return {
    isActive: status === 'active',
    isPending: status === 'incomplete' || status === 'incomplete_expired',
    isPastDue: status === 'past_due',
    isCanceled: status === 'canceled',
    isExpired: status === 'canceled' && currentPeriodEnd < new Date(),
    currentPeriodEnd
  };
}

// Format amount for display
export function formatAmount(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

// Payment method utilities
export async function attachPaymentMethod(
  paymentMethodId: string,
  customerId: string
): Promise<Stripe.PaymentMethod> {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    return paymentMethod;
  } catch (error) {
    console.error('Error attaching payment method:', error);
    throw new Error('Failed to attach payment method');
  }
}

export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    return customer;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw new Error('Failed to set default payment method');
  }
}
