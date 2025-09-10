// app/plans/page.tsx (or wherever you set the period)
'use client';
import { useState } from 'react';

type Period = 'month' | 'annual';             // 👈 'annual' (not 'year')

export default function PlansPage() {
  const [period, setPeriod] = useState<Period>('month');

  return (
    <>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Pick a monthly or yearly plan, then continue to checkout.
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-xl border p-1 text-xs">
        <button onClick={() => setPeriod('month')}
                className={`rounded-lg px-3 py-1 ${period === 'month' ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}>
          Monthly
        </button>

        <button onClick={() => setPeriod('annual')}   // 👈 use 'annual'
                className={`rounded-lg px-3 py-1 ${period === 'annual' ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}>
          Yearly
        </button>
      </div>

      {/* wherever you pass planPeriod */}
      {/* <CheckoutProvider ... planId="cplan_..." planPeriod={period}> ... </CheckoutProvider> */}
    </>
  );
}
