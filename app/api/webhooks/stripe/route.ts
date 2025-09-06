// app/api/webhooks/stripe/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { headers } from 'next/headers';
import { clerkClient } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: Request) {
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whSecret) return new Response('Missing STRIPE_WEBHOOK_SECRET', { status: 500 });

  const sig = headers().get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, whSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId =
          (session.metadata?.clerkUserId as string | undefined) ??
          (session.subscription ? undefined : undefined);

        // Prefer metadata from the created Subscription (if available)
        if (!clerkUserId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          const fromSub = sub.metadata?.clerkUserId as string | undefined;
          if (fromSub) {
            await clerkClient.users.updateUser(fromSub, {
              publicMetadata: { accountType: 'creator', plan: 'subscriber' },
            });
          }
        } else if (clerkUserId) {
          await clerkClient.users.updateUser(clerkUserId, {
            publicMetadata: { accountType: 'creator', plan: 'subscriber' },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const clerkUserId = sub.metadata?.clerkUserId as string | undefined;
        if (clerkUserId) {
          await clerkClient.users.updateUser(clerkUserId, {
            publicMetadata: { accountType: 'listener', plan: 'free' },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        // Optional: map active/canceled/paused to plans if you want
        break;
      }
    }

    return new Response('ok', { status: 200 });
  } catch (err) {
    return new Response('Handler error', { status: 500 });
  }
}
