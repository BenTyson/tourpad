import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement Stripe webhook handling when environment variables are configured
    console.log('Stripe webhook received but not configured yet');
    return NextResponse.json({ received: true, status: 'development_mode' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
