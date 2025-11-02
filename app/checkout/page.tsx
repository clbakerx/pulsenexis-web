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
import { Suspense } from 'react';
import Header from '../components/Header';

type Period = 'month' | 'annual';

// (Recommended) put these in .env.local as NEXT_PUBLIC_CLERK_MONTHLY_PLAN_ID / NEXT_PUBLIC_CLERK_ANNUAL_PLAN_ID
const MONTHLY_PLAN_ID =
  process.env.NEXT_PUBLIC_CLERK_MONTHLY_PLAN_ID ?? 'cplan_month_placeholder';
const ANNUAL_PLAN_ID =
  process.env.NEXT_PUBLIC_CLERK_ANNUAL_PLAN_ID ?? 'cplan_annual_placeholder';

function CheckoutContent() {
  const search = useSearchParams();
  const q = (search.get('period') as Period) || 'month';
  const period: Period = q === 'annual' ? 'annual' : 'month';
  const planId = period === 'annual' ? ANNUAL_PLAN_ID : MONTHLY_PLAN_ID;

  return (
    <CheckoutProvider for="user" planId={planId} planPeriod={period}>
      <ClerkLoaded>
        <SignedIn>
          <CustomCheckout period={period} />
        </SignedIn>
      </ClerkLoaded>
    </CheckoutProvider>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container mx-auto px-6 py-16"><div className="max-w-2xl mx-auto text-center">Loading checkout...</div></div>}>
        <CheckoutContent />
      </Suspense>
    </>
  );
}

function CustomCheckout({ period }: { period: Period }) {
  const { checkout } = useCheckout();
  const { status, start } = checkout;

  // Initialize the checkout session once
  React.useEffect(() => {
    if (status === 'needs_initialization') {
      start();
    }
  }, [status, start]);

  const planDisplayName = period === 'annual' ? 'Annual Plan' : 'Monthly Plan';
  const planPrice = period === 'annual' ? '$99' : '$9.99';
  const planBilling = period === 'annual' ? 'per year' : 'per month';
  const savings = period === 'annual' ? 'Save $20 per year' : '';

  return (
    <main className="container mx-auto px-6 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Complete Your Purchase</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Secure checkout powered by Stripe
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{planDisplayName}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Full access to PulseNexis
                  </p>
                  {savings && (
                    <p className="text-sm text-green-600 font-medium mt-1">{savings}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{planPrice}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{planBilling}</p>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>{planPrice} {planBilling}</span>
                </div>
              </div>
            </div>

            {/* Features included */}
            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <h3 className="font-medium mb-3">What's included:</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full platform access
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  24/7 Support
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cancel anytime
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Payment Details</h2>
            
            <PaymentElementProvider checkout={checkout}>
              <div className="space-y-4">
                <PaymentElement />
                <PayButton />
              </div>
            </PaymentElementProvider>

            {/* Security notice */}
            <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
              <p>🔒 Your payment information is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function PayButton() {
  const { checkout } = useCheckout();
  const { isFormReady, submit } = usePaymentElement();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onPay() {
    if (!isFormReady || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await submit(); // collect card details
      await checkout.confirm({}); // confirm the checkout
      // Redirect will be handled by Clerk's success URL configuration
      window.location.href = '/thank-you';
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      onClick={onPay}
      disabled={!isFormReady || isSubmitting}
      className="w-full rounded-xl bg-black text-white px-4 py-3 text-sm font-medium shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        'Complete Purchase'
      )}
    </button>
  );
}
