import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Price IDs from environment
export const PRICE_IDS = {
  ARTIST_ANNUAL: process.env.STRIPE_ARTIST_ANNUAL_PRICE_ID!,
  FAN_MONTHLY: process.env.STRIPE_FAN_MONTHLY_PRICE_ID!,
} as const;

// Helper to format price for display
export const formatPrice = (amount: number, currency = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Stripe uses cents
};