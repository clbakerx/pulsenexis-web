"use client";

import * as React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
// Clerk Billing is currently beta; these live under experimental
import { usePlans } from "@clerk/nextjs/experimental";

type Period = "month" | "year";

export default function PlansPage() {
  const [period, setPeriod] = React.useState<Period>("month");
  const { data: plans, isLoading, error } = usePlans({ for: "user" });

  return (
    <main className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Choose your plan</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Pick a monthly or yearly plan, then continue to checkout.
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-xl border p-1 text-xs">
        <button
          onClick={() => setPeriod("month")}
          className={`rounded-lg px-3 py-1 ${period === "month" ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setPeriod("year")}
          className={`rounded-lg px-3 py-1 ${period === "year" ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}
        >
          Yearly
        </button>
      </div>

      <div className="mt-8">
        <SignedOut>
          <div className="mb-6 rounded-xl border p-4">
            <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
              Please sign in to subscribe.
            </p>
            <SignInButton mode="modal">Sign in</SignInButton>
          </div>
        </SignedOut>

        {isLoading && <p className="text-sm text-neutral-500">Loading plans…</p>}
        {error && (
          <p className="text-sm text-red-600">
            Couldn’t load plans. Make sure Billing is enabled and plans exist in your Clerk dashboard.
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(plans ?? []).map((plan: any) => (
            <article key={plan.id} className="rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold">{plan.name ?? "Untitled plan"}</h2>
              {plan.description && (
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{plan.description}</p>
              )}

              {/* Display period (price details come from checkout totals) */}
              <div className="mt-4 text-2xl font-bold">{period === "month" ? "Monthly" : "Yearly"}</div>

              <div className="mt-6 flex items-center gap-3">
                <Link
                  href={`/checkout?planId=${encodeURIComponent(plan.id)}&period=${period}`}
                  className="rounded-xl bg-black text-white px-4 py-2 text-sm shadow-md hover:opacity-90 dark:bg-white dark:text-black"
                >
                  Continue
                </Link>
                <Link
                  href={`/checkout?planId=${encodeURIComponent(plan.id)}&period=${period}`}
                  className="text-xs text-neutral-500 underline-offset-2 hover:underline"
                >
                  Details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
