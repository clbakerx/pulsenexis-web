// app/checkout/page.tsx
'use client';

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useState } from 'react';

export default function CheckoutPage() {
  const [plan, setPlan] = useState<'listener' | 'creator'>('listener');
  const [interval, setInterval] = useState<'month' | 'year'>('month');
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan, interval }),
      });

      if (!res.ok) {
        setLoading(false);
        alert('Failed to start checkout');
        return;
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      setLoading(false);
      alert('Something went wrong starting checkout');
    }
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <main style={{ maxWidth: 640, margin: '40px auto', textAlign: 'center' }}>
          <h1>Choose your plan</h1>

          {/* Plan */}
          <div style={{ marginTop: 24 }}>
            <strong>Role:</strong>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
              <label>
                <input
                  type="radio"
                  name="plan"
                  value="listener"
                  checked={plan === 'listener'}
                  onChange={() => setPlan('listener')}
                />{' '}
                Listener ($9.99/mo • $119/yr)
              </label>
              <label>
                <input
                  type="radio"
                  name="plan"
                  value="creator"
                  checked={plan === 'creator'}
                  onChange={() => setPlan('creator')}
                />{' '}
                Creator ($19/mo • $225/yr)
              </label>
            </div>
          </div>

          {/* Interval */}
          <div style={{ marginTop: 24 }}>
            <strong>Billing interval:</strong>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
              <label>
                <input
                  type="radio"
                  name="interval"
                  value="month"
                  checked={interval === 'month'}
                  onChange={() => setInterval('month')}
                />{' '}
                Monthly
              </label>
              <label>
                <input
                  type="radio"
                  name="interval"
                  value="year"
                  checked={interval === 'year'}
                  onChange={() => setInterval('year')}
                />{' '}
                Yearly
              </label>
            </div>
          </div>

          <button
            onClick={startCheckout}
            disabled={loading}
            style={{
              marginTop: 28,
              padding: '10px 18px',
              borderRadius: 8,
              border: '1px solid #111',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Starting…' : 'Subscribe'}
          </button>
        </main>
      </SignedIn>
    </>
  );
}
