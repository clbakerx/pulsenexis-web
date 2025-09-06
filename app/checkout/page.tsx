// app/checkout/page.tsx
'use client';

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useState } from 'react';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout/session', { method: 'POST' });
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
      <SignedOut><RedirectToSignIn /></SignedOut>
      <SignedIn>
        <main style={{ maxWidth: 640, margin: '40px auto', textAlign: 'center' }}>
          <h1>Subscribe to PulseNexis</h1>
          <p>Unlock creator tools and HQ downloads.</p>
          <button
            onClick={startCheckout}
            disabled={loading}
            style={{
              marginTop: 16,
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid #444',
              background: loading ? '#333' : '#111',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Starting checkout…' : 'Subscribe'}
          </button>
        </main>
      </SignedIn>
    </>
  );
}
