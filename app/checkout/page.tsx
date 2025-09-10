'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { ClerkLoaded, SignedIn } from '@clerk/nextjs';
import {
  CheckoutProvider,
  useCheckout,
  PaymentElementProvider,
  PaymentElement,
  usePaymentElement,
} from '@clerk/nextjs/experimental';

type Period = 'month' | 'annual';

// (Recommended) put these in .env.local as NEXT_PUBLIC_CLERK_MONTHLY_PLAN_ID / NEXT_PUBLIC_CLERK_ANNUAL_PLAN_ID
const MONTHLY_PLAN_ID =
  process.env.NEXT_PUBLIC_CLERK_MONTHLY_PLAN_ID ?? 'cplan_month_placeholder';
const ANNUAL_PLAN_ID =
  process.env.NEXT_PUBLIC_CLERK_ANNUAL_PLAN_ID ?? 'cplan_annual_placeholder';

export default function CheckoutPage() {
  const search = useSearchParams();
  const q = (search.get('period') as Period) || 'month';
  const period: Period = q === 'annual' ? 'annual' : 'month';
  const planId = period === 'annual' ? ANNUAL_PLAN_ID : MONTHLY_PLAN_ID;

  return (
    <CheckoutProvider for="user" planId={planId} planPeriod={period}>
      <ClerkLoaded>
        <SignedIn>
          <CustomCheckout />
        </SignedIn>
      </ClerkLoaded>
    </CheckoutProvider>
  );
}

function CustomCheckout() {
  const { checkout } = useCheckout();
  const { status, start } = checkout;

  // Initialize the checkout session once
  React.useEffect(() => {
    if (status === 'needs_initialization') {
      start();
    }
  }, [status, start]);

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Checkout</h1>

      <PaymentElementProvider checkout={checkout}>
        <PaymentElement />
        <PayButton />
      </PaymentElementProvider>
    </div>
  );
}

function PayButton() {
  const { checkout, isLoaded } = useCheckout();
  const { isFormReady, submit, isSubmitting } = usePaymentElement();

  async function onPay() {
    if (!isLoaded || !isFormReady) return;
    await submit(); // collect card details
    await checkout.confirm({ redirectUrl: '/thank-you' }); // <-- pass redirectUrl here
  }

  return (
    <button
      onClick={onPay}
      disabled={!isFormReady || isSubmitting}
      className="mt-4 w-full rounded-md border px-4 py-2"
    >
      {isSubmitting ? 'Processing…' : 'Pay now'}
    </button>
  );
}
