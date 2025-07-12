import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createCheckoutSession, getCustomerByEmail, createCustomer, ARTIST_SUBSCRIPTION } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user } = session;
    const body = await request.json();
    const { priceId, successUrl, cancelUrl } = body;

    // Validate required fields
    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: priceId, successUrl, cancelUrl' },
        { status: 400 }
      );
    }

    // Only artists can create subscriptions
    if (user.type !== 'artist') {
      return NextResponse.json(
        { error: 'Only artists can purchase subscriptions' },
        { status: 403 }
      );
    }

    // Find or create Stripe customer
    let customer = await getCustomerByEmail(user.email);
    if (!customer) {
      customer = await createCustomer({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
          userType: user.type
        }
      });
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      customerId: customer.id,
      priceId,
      successUrl,
      cancelUrl,
      metadata: {
        userId: user.id,
        userType: user.type,
        subscriptionType: 'artist_annual'
      }
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
