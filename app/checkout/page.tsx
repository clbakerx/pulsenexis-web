// app/checkout/page.tsx
"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const PLAN_ID = process.env.NEXT_PUBLIC_CLERK_PLAN_ID!; // e.g. "cplan_abc123"

export default function CheckoutPage() {
  return (
    <main className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

      <SignedIn>
        <div className="mt-6 space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            You’re signed in. (Plan: <code>{PLAN_ID}</code>)
          </p>
          {/* Your checkout UI here */}
          <UserButton />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="mt-6">
          <p className="mb-3 text-neutral-600 dark:text-neutral-400">
            Please sign in to continue to checkout.
          </p>
          <SignInButton mode="modal">Sign in</SignInButton>
        </div>
      </SignedOut>
    </main>
  );
}
