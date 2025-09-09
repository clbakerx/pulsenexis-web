"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton, ClerkLoaded } from "@clerk/nextjs";
import {
  CheckoutProvider,
  useCheckout,
  PaymentElementProvider,
  PaymentElement,
  usePaymentElement,
} from "@clerk/nextjs/experimental";

const FALLBACK_PLAN_ID = process.env.NEXT_PUBLIC_CLERK_PLAN_ID;
type Period = "month" | "year";

export default function CheckoutPage() {
  const params = useSearchParams();
  const planId = (params.get("planId") ?? FALLBACK_PLAN_ID ?? "").trim();
  const planPeriod = (params.get("period") === "year" ? "year" : "month") as Period;

  return (
    <main className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

      {!planId && (
        <p className="mt-3 text-sm text-red-600">
          Missing a planId. Pass <code>?planId=cplan_xxx</code> (and optional <code>&period=month|year</code>) in the URL,
          or set <code>NEXT_PUBLIC_CLERK_PLAN_ID</code>.
        </p>
      )}

      <ClerkLoaded>
        <SignedOut>
          <div className="mt-6">
            <p className="mb-3 text-neutral-600 dark:text-neutral-400">
              Please sign in to continue to checkout.
            </p>
            <SignInButton mode="modal">Sign in</SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Using plan: <code>{planId || "—"}</code> ({planPeriod})
            </div>
            <UserButton />
          </div>

          {planId && (
            <CheckoutProvider for="user" planId={planId} planPeriod={planPeriod}>
              <CustomCheckout />
            </CheckoutProvider>
          )}
        </SignedIn>
      </ClerkLoaded>
    </main>
  );
}

function CustomCheckout() {
  const { checkout } = useCheckout();
  const { status } = checkout;

  if (status === "needs_initialization") {
    return <CheckoutInitialization />;
  }

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-2">
      <CheckoutSummary />
      <PaymentElementProvider checkout={checkout}>
        <PaymentSection />
      </PaymentElementProvider>
    </div>
  );
}

function CheckoutInitialization() {
  const { checkout } = useCheckout();
  const { start, status, fetchStatus } = checkout;

  if (status !== "needs_initialization") return null;

  return (
    <button
      onClick={start}
      disabled={fetchStatus === "fetching"}
      className="rounded-xl bg-black text-white px-4 py-2 text-sm shadow-md hover:opacity-90 dark:bg-white dark:text-black"
    >
      {fetchStatus === "fetching" ? "Initializing…" : "Start checkout"}
    </button>
  );
}

function PaymentSection() {
  const { checkout } = useCheckout();
  const { isConfirming, confirm, finalize, error } = checkout;
  const { isFormReady, submit } = usePaymentElement();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormReady || isProcessing) return;
    setIsProcessing(true);
    try {
      const { data, error } = await submit();  // 1) collect payment method
      if (error) return;                       // element shows validation errors
      await confirm(data);                     // 2) confirm checkout
      finalize({ redirectUrl: "/thank-you" }); // 3) complete & redirect
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border p-6 shadow-sm">
      <PaymentElement fallback={<div>Loading payment element…</div>} />
      {error && <div className="mt-2 text-sm text-red-600">{error.message}</div>}

      <button
        type="submit"
        disabled={!isFormReady || isProcessing || isConfirming}
        className="mt-4 w-full rounded-xl bg-black text-white px-4 py-2 text-sm shadow-md hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
      >
        {isProcessing || isConfirming ? "Processing…" : "Complete purchase"}
      </button>
    </form>
  );
}

function CheckoutSummary() {
  const { checkout } = useCheckout();
  const { plan, totals } = checkout;

  if (!plan) return null;

  return (
    <aside className="rounded-2xl border p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Order summary</h2>
      <div className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
        <div className="flex items-center justify-between">
          <span>{plan.name}</span>
          {totals?.totalDueNow && (
            <span>
              {totals.totalDueNow.currencySymbol} {totals.totalDueNow.amountFormatted}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
