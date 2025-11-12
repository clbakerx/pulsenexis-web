// app/api/checkout/session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.warn('STRIPE_SECRET_KEY is not set');
}
const stripe = new Stripe(stripeKey || 'sk_test_placeholder', { apiVersion: '2024-06-20' });

type Plan = 'subscriber';
type Interval = 'month' | 'year';

// Updated price structure to match your monthly/annual plans
const PRICE: Record<Plan, Record<Interval, string>> = {
  subscriber: {
    month: process.env.STRIPE_PRICE_MONTHLY || '',
    year : process.env.STRIPE_PRICE_ANNUAL || '',
  },
};

export async function POST(req: Request) {
  try {
    const { plan, interval, userId } = await req.json();

    // Default to subscriber plan if not specified
    const selectedPlan: Plan = plan || 'subscriber';
    
    const price = PRICE?.[selectedPlan]?.[interval as Interval];
    if (!price) {
      console.error(`Missing price ID for plan: ${selectedPlan}, interval: ${interval}`);
      return new NextResponse('Missing or invalid price ID for plan/interval', { status: 400 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL}/plans?cancelled=true`,
      metadata: {
        userId: userId, // Store user ID for webhook processing
        plan: selectedPlan,
        interval: interval,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          plan: selectedPlan,
          interval: interval,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout session creation failed:', err);
    return new NextResponse('Failed to create session', { status: 500 });
  }
}
