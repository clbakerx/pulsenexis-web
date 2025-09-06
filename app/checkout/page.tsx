// app/checkout/page.tsx
'use client';

import { useState } from 'react';

type Plan = 'listener' | 'creator';
type Interval = 'month' | 'year';

export default function CheckoutPage() {
  const [plan, setPlan] = useState<Plan>('listener');
  const [interval, setInterval] = useState<Interval>('month');
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      console.error(err);
      alert('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>Choose your plan</h1>

      <div style={{ marginTop: 16 }}>
        <strong>Role</strong>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={() => setPlan('listener')} aria-pressed={plan==='listener'}>Listener</button>
          <button onClick={() => setPlan('creator')} aria-pressed={plan==='creator'}>Creator</button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Billing</strong>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={() => setInterval('month')} aria-pressed={interval==='month'}>Monthly</button>
          <button onClick={() => setInterval('year')} aria-pressed={interval==='year'}>Yearly</button>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button onClick={startCheckout} disabled={loading}>
          {loading ? 'Starting…' : 'Upgrade'}
        </button>
      </div>
    </main>
  );
}
