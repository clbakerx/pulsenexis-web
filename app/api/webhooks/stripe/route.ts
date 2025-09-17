export const runtime = "nodejs";

import { NextRequest } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig) return new Response("Missing signature", { status: 400 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Invalid signature: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    // default label; prefer price metadata if you set it
    let planLabel = "subscriber";

    if (session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription as string, {
        expand: ["items.data.price"],
      });
      const price = sub.items.data[0]?.price;

      // If you added metadata on prices in Stripe, use it:
      planLabel = (price?.metadata?.plan as string) || planLabel;
    }

    if (userId) {
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          plan: planLabel,
          stripeCustomerId: session.customer as string | undefined,
          stripeSubscriptionId: session.subscription as string | undefined,
        },
      });
    }
  }

  return new Response("ok");
}
