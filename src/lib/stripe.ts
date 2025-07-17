// Mock Stripe service
export interface StripeSession {
  id: string;
  url: string;
  status: string;
}

export async function createCheckoutSession(priceId: string, userId: string): Promise<StripeSession> {
  // Mock implementation
  return {
    id: 'cs_test_123',
    url: 'https://checkout.stripe.com/pay/cs_test_123',
    status: 'open'
  };
}

export async function getSession(sessionId: string): Promise<StripeSession | null> {
  // Mock implementation
  return {
    id: sessionId,
    url: 'https://checkout.stripe.com/pay/' + sessionId,
    status: 'complete'
  };
}