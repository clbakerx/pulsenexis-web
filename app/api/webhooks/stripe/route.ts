// app/api/webhooks/stripe/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { headers } from 'next/headers';
import { clerkClient } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: Request) {
  const signature = headers().get('stripe-signature');
  if (!signature) return new Response('Missing Stripe signature', { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // We stored the Clerk user id in metadata when creating the session/subscription
        let clerkUserId = (session.metadata?.clerkUserId as string | undefined) ?? undefined;

        // If not present, fetch the subscription to read metadata there
        if (!clerkUserId && typeof session.subscription === 'string') {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          clerkUserId = sub.metadata?.clerkUserId as string | undefined;
        }

        if (clerkUserId) {
          await clerkClient.users.updateUser(clerkUserId, {
            publicMetadata: { plan: 'subscriber' },
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const uid = sub.metadata?.clerkUserId as string | undefined;
        if (uid) {
          const plan = (sub.status === 'active' || sub.status === 'trialing') ? 'subscriber' : 'free';
          await clerkClient.users.updateUser(uid, {
            publicMetadata: { plan },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const uid = sub.metadata?.clerkUserId as string | undefined;
        if (uid) {
          await clerkClient.users.updateUser(uid, {
            publicMetadata: { plan: 'free' },
          });
        }
        break;
      }

      default:
        // ignore other events
        break;
    }
  } catch (err: any) {
    return new Response(`Handler error: ${err.message}`, { status: 500 });
  }

  return new Response('ok', { status: 200 });
}
