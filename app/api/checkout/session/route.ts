// app/api/checkout/session/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { auth, currentUser } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST() {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) return new Response('Missing STRIPE_PRICE_ID', { status: 500 });

  const APP_URL = process.env.APP_URL || 'https://app.pulsenexis.com';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${APP_URL}/dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/dashboard?status=cancelled`,
    // Put Clerk user id into both Session and Subscription metadata
    metadata: { clerkUserId: userId },
    subscription_data: { metadata: { clerkUserId: userId } },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
