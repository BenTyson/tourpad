import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Payment verification started');
    
    // Get current session
    const session = await auth();
    if (!session?.user?.id) {
      console.log('❌ Unauthorized: No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestBody = await request.json();
    const { sessionId } = requestBody;
    console.log('📋 Request body received:', requestBody);
    console.log('📋 Session ID extracted:', sessionId);

    if (!sessionId) {
      console.log('❌ No session ID provided in request body');
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Get the Stripe checkout session
    console.log('💳 Retrieving Stripe checkout session...');
    let checkoutSession;
    try {
      checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      console.log('💳 Checkout session retrieved successfully:', {
        id: checkoutSession.id,
        payment_status: checkoutSession.payment_status,
        customer: checkoutSession.customer,
        amount_total: checkoutSession.amount_total,
        payment_intent: checkoutSession.payment_intent
      });
    } catch (stripeError) {
      console.error('❌ Stripe API error:', stripeError);
      return NextResponse.json({
        error: 'Failed to retrieve Stripe session',
        details: stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error'
      }, { status: 500 });
    }
    
    if (checkoutSession.payment_status !== 'paid') {
      console.log('❌ Payment not completed:', checkoutSession.payment_status);
      return NextResponse.json({ 
        error: 'Payment not completed',
        paymentStatus: checkoutSession.payment_status 
      }, { status: 400 });
    }

    // Get current user from database
    console.log('👤 Looking up user in database:', session.user.id);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        payments: true,
        subscription: true
      }
    });

    if (!user) {
      console.error('❌ User not found in database:', session.user.id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('🔍 Payment verification for user:', {
      id: user.id,
      email: user.email,
      status: user.status,
      type: user.type,
      existingPayments: user.payments?.length || 0,
      hasSubscription: !!user.subscription
    });

    // Check if user needs to be activated
    // Accept both PENDING and APPROVED status for testing (new registrations start as PENDING)
    if ((user.status === 'APPROVED' || user.status === 'PENDING') && checkoutSession.payment_status === 'paid') {
      console.log('💡 Activating user after successful payment...', 'Current status:', user.status);
      
      // Create payment record if it doesn't exist
      const existingPayment = user.payments.find(p => 
        p.stripePaymentId === checkoutSession.payment_intent ||
        p.stripePaymentId === sessionId
      );

      if (!existingPayment) {
        console.log('📝 Creating missing payment record...');
        await prisma.payment.create({
          data: {
            userId: user.id,
            stripePaymentId: checkoutSession.payment_intent as string || sessionId,
            stripeCustomerId: checkoutSession.customer as string,
            amount: checkoutSession.amount_total || 40000,
            currency: 'usd',
            status: 'SUCCEEDED',
            description: 'Artist Annual Membership (Manual Verification)',
            paymentType: 'ARTIST_ANNUAL'
          }
        });
      }

      // Create or update subscription
      if (!user.subscription) {
        console.log('📝 Creating subscription record...');
        const now = new Date();
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(now.getFullYear() + 1);

        await prisma.subscription.create({
          data: {
            userId: user.id,
            stripeCustomerId: checkoutSession.customer as string,
            status: 'ACTIVE',
            currentPeriodStart: now,
            currentPeriodEnd: oneYearFromNow,
            amount: checkoutSession.amount_total || 40000,
            interval: 'year'
          }
        });
      }

      // Update user status to ACTIVE
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          status: 'ACTIVE',
          stripeCustomerId: checkoutSession.customer as string
        }
      });

      console.log('✅ User activated successfully:', user.id);
      
      return NextResponse.json({ 
        success: true, 
        message: 'User activated successfully',
        previousStatus: user.status,
        newStatus: 'ACTIVE'
      });
    }

    // User is already active or payment status doesn't require activation
    return NextResponse.json({ 
      success: true, 
      message: 'No activation needed',
      userStatus: user.status,
      paymentStatus: checkoutSession.payment_status
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ 
      error: 'Failed to verify payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}