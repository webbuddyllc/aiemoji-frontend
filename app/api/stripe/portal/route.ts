import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { customerId, returnUrl } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Create Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${req.nextUrl.origin}/subscription`,
    });

    return NextResponse.json({ 
      success: true, 
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe portal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
