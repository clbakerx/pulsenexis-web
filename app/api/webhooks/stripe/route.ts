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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) {
        console.warn("No userId found in session metadata");
        break;
      }

      // Get plan information from session metadata
      let planLabel = session.metadata?.plan || "subscriber";
      let planInterval = session.metadata?.interval || "month";
      
      // Also try to get info from subscription if available
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string, {
          expand: ["items.data.price"],
        });
        const price = sub.items.data[0]?.price;

        // Override with price metadata if available
        planLabel = (price?.metadata?.plan as string) || planLabel;
        planInterval = (price?.recurring?.interval as string) || planInterval;
      }

      try {
        await clerkClient.users.updateUser(userId, {
          publicMetadata: {
            plan: planLabel,
            planInterval: planInterval,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            subscriptionStatus: 'active',
            lastPaymentAt: new Date().toISOString(),
          },
        });
        
        console.log(`Updated user ${userId} with plan: ${planLabel} (${planInterval})`);
      } catch (error) {
        console.error(`Failed to update user ${userId}:`, error);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Find user by Stripe customer ID
      const users = await clerkClient.users.getUserList({
        limit: 100,
      });

      const user = users.data.find(u => 
        u.publicMetadata?.stripeCustomerId === customerId
      );

      if (user) {
        await clerkClient.users.updateUser(user.id, {
          publicMetadata: {
            ...user.publicMetadata,
            subscriptionStatus: subscription.status,
            lastUpdatedAt: new Date().toISOString(),
          },
        });
        
        console.log(`Updated subscription status for user ${user.id}: ${subscription.status}`);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Find user by Stripe customer ID
      const users = await clerkClient.users.getUserList({
        limit: 100,
      });

      const user = users.data.find(u => 
        u.publicMetadata?.stripeCustomerId === customerId
      );

      if (user) {
        await clerkClient.users.updateUser(user.id, {
          publicMetadata: {
            ...user.publicMetadata,
            subscriptionStatus: 'cancelled',
            cancelledAt: new Date().toISOString(),
          },
        });
        
        console.log(`Cancelled subscription for user ${user.id}`);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response("ok");
}
