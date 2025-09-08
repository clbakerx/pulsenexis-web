// app/checkout/page.tsx
'use client';

import * as React from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  ClerkLoaded,
} from '@clerk/nextjs';

import {
  CheckoutProvider,
  useCheckout,
  PaymentElementProvider,
  PaymentElement,
  usePaymentElement,
  SubscriptionDetailsButton,
} 

// ✅ TODO: Put your real Clerk Plan ID here (e.g. "cplan_abc123")
const PLAN_ID = 'cplan_XXXXXXXX';
// "month" or "year"
const DEFAULT_PERIOD: 'month' | 'year' = 'month';

export default function CheckoutPage() {
  const [period, setPeriod] = React.useState<'month' | 'year'>(DEFAULT_PERIOD);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2">Checkout</h1>
      <p className="text-sm text-gray-600 mb-8">
        Securely subscribe to PulseNexis. You can manage your plan anytime.
      </p>

      <SignedOut>
        <div className="rounded-lg border p-6">
          <p className="mb-4">Please sign in to continue to checkout.</p>
          <SignInButton redirectUrl="/checkout">
            <button className="rounded-md bg-black px-4 py-2 text-white">
              Sign in
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <ClerkLoaded>
          {/* Period toggle (optional) */}
          <div className="mb-6 inline-flex rounded-lg border overflow-hidden">
            <button
              className={`px-4 py-2 ${period === 'month' ? 'bg-black text-white' : ''}`}
              onClick={() => setPeriod('month')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 ${period === 'year' ? 'bg-black text-white' : ''}`}
              onClick={() => setPeriod('year')}
            >
              Yearly
            </button>
          </div>

          {/* The provider sets up the Clerk checkout state */}
          <CheckoutProvider for="user" planId={PLAN_ID} planPeriod={period}>
            <CheckoutShell />
          </CheckoutProvider>

          {/* Manage subscription drawer (works when the user already has a plan) */}
          <div className="mt-10">
            <SubscriptionDetailsButton>
              <button className="rounded-md px-4 py-2 border">
                Manage subscription
              </button>
            </SubscriptionDetailsButton>
          </div>
        </ClerkLoaded>
      </SignedIn>
    </main>
  );
}

/* --------------------------- Internal UI pieces --------------------------- */

function CheckoutShell() {
  const { checkout } = useCheckout();

  // Show a small order summary card if the plan is loaded
  const Summary = () => {
    const { plan, totals } = checkout;
    if (!plan) return null;
    return (
      <div className="mb-6 rounded-lg border p-4">
        <h2 className="font-medium mb-1">Order Summary</h2>
        <div className="text-sm text-gray-700">{plan.name}</div>
        <div className="mt-2 text-lg font-semibold">
          {totals.totalDueNow.currencySymbol} {totals.totalDueNow.amountFormatted}
        </div>
      </div>
    );
  };

  // First-time state: user needs to initialize the checkout
  if (checkout.status === 'needs_initialization') {
    return (
      <div className="rounded-lg border p-6">
        <p className="mb-4">Click below to start your secure checkout.</p>
        <button
          onClick={checkout.start}
          disabled={checkout.fetchStatus === 'fetching'}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {checkout.fetchStatus === 'fetching' ? 'Initializing…' : 'Start checkout'}
        </button>
      </div>
    );
  }

  // Ready state: render the payment element + confirm/finalize
  return (
    <div>
      <Summary />
      <PaymentElementProvider checkout={checkout}>
        <PaymentForm />
      </PaymentElementProvider>
    </div>
  );
}

function PaymentForm() {
  const { checkout } = useCheckout();
  const { isConfirming, confirm, finalize, error } = checkout;

  const { isFormReady, submit } = usePaymentElement();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormReady || isProcessing) return;

    setIsProcessing(true);
    try {
      // 1) Collect payment details from the Payment Element
      const { data } = await submit();

      // 2) Confirm the payment + subscription
      await confirm(data);

      // 3) Finalize and redirect (change to your post-purchase page)
      await finalize({ redirectUrl: '/account/billing' });
    } catch (_e) {
      // error is also exposed via `checkout.error`
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-lg border p-4">
      <PaymentElement fallback={<div>Loading payment form…</div>} />

      {error && (
        <div className="mt-3 text-sm text-red-600">
          {error.message ?? 'Something went wrong. Please try again.'}
        </div>
      )}

      <button
        type="submit"
        disabled={!isFormReady || isProcessing || isConfirming}
        className="mt-4 rounded-md bg-black px-5 py-2.5 text-white disabled:opacity-60"
      >
        {isProcessing || isConfirming ? 'Processing…' : 'Complete purchase'}
      </button>
    </form>
  );
}
