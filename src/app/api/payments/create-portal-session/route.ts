import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    // Create Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/subscription/manage`,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error) {
    console.error('Error creating portal session:', error);
    
    // Handle Stripe configuration errors specifically
    if (error instanceof Error && error.message.includes('No configuration provided')) {
      return NextResponse.json(
        { 
          error: 'Billing portal not configured',
          message: 'The billing portal is not set up yet. Please contact support for billing changes.',
          supportEmail: 'support@tourpad.com'
        },
        { status: 503 } // Service Unavailable
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}