// app/api/checkout/session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.warn('STRIPE_SECRET_KEY is not set');
}
const stripe = new Stripe(stripeKey || 'sk_test_placeholder', { apiVersion: '2024-06-20' });

type Plan = 'listener' | 'creator';
type Interval = 'month' | 'year';

const PRICE: Record<Plan, Record<Interval, string>> = {
  listener: {
    month: process.env.STRIPE_PRICE_LISTENER_MONTH || '',
    year : process.env.STRIPE_PRICE_LISTENER_YEAR  || '',
  },
  creator: {
    month: process.env.STRIPE_PRICE_CREATOR_MONTH || '',
    year : process.env.STRIPE_PRICE_CREATOR_YEAR  || '',
  },
};

export async function POST(req: Request) {
  try {
    const { plan, interval } = await req.json();

    const price = PRICE?.[plan as Plan]?.[interval as Interval];
    if (!price) {
      return new NextResponse('Missing or invalid price ID for plan/interval', { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.APP_URL}/dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/dashboard?status=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return new NextResponse('Failed to create session', { status: 500 });
  }
}
