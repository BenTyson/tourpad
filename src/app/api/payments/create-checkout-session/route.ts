import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe-server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { priceId, userType } = body;

    // Validate price ID matches user type
    const isArtist = userType === 'artist' && priceId === process.env.STRIPE_ARTIST_ANNUAL_PRICE_ID;
    const isFan = userType === 'fan' && priceId === process.env.STRIPE_FAN_MONTHLY_PRICE_ID;
    
    if (!isArtist && !isFan) {
      return NextResponse.json({ error: 'Invalid price configuration' }, { status: 400 });
    }

    // Get or create Stripe customer
    let stripeCustomerId = (session.user as any).stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
          userType: userType
        }
      });
      
      stripeCustomerId = customer.id;
      
      // Save customer ID to database
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId }
      });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment/${userType}`,
      metadata: {
        userId: session.user.id,
        userType: userType,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          userType: userType,
        }
      }
    });

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    });
    
  } catch (error) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}