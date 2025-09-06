// app/checkout/page.tsx
'use client';

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useState } from 'react';

type Plan = 'listener' | 'creator';
type Interval = 'month' | 'year';

export default function CheckoutPage() {
  const [plan, setPlan] = useState<Plan>('listener');
  const [interval, setInterval] = useState<Interval>('month');
  const [loading, setLoading] = useState(false);

  const prices = {
    listener: { month: '$9.99', year: '$119.00' },
    creator:  { month: '$19.00', year: '$225.00' },
  };

  async function startCheckout() {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan, interval }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
          <h1>Choose your plan</h1>

          <section style={{ marginTop: 16 }}>
            <strong>Role</strong>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button aria-pressed={plan === 'listener'} onClick={() => setPlan('listener')}>
                Listener
              </button>
              <button aria-pressed={plan === 'creator'} onClick={() => setPlan('creator')}>
                Creator
              </button>
            </div>
          </section>

          <section style={{ marginTop: 16 }}>
            <strong>Billing</strong>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button aria-pressed={interval === 'month'} onClick={() => setInterval('month')}>
                Monthly ({prices[plan].month})
              </button>
              <button aria-pressed={interval === 'year'} onClick={() => setInterval('year')}>
                Yearly ({prices[plan].year})
              </button>
            </div>
          </section>

          <div style={{ marginTop: 24 }}>
            <button onClick={startCheckout} disabled={loading}>
              {loading ? 'Starting…' : 'Upgrade'}
            </button>
          </div>
        </main>
      </SignedIn>
    </>
  );
}
