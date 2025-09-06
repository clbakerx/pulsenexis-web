'use client';

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useState } from 'react';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    const res = await fetch('/api/checkout/session', { method: 'POST' });
    if (!res.ok) { setLoading(false); alert('Failed to start checkout'); return; }
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <>
      <SignedOut><RedirectToSignIn /></SignedOut>
      <SignedIn>
        <main style={{ maxWidth: 640, margin: '40px auto', textAlign: 'center' }}>
          <h1>Subscribe to PulseNexis</h1>
          <p style={{ color: '#555' }}>Unlock HQ downloads and more.</p>
          <button
            onClick={startCheckout}
            disabled={loading}
            style={{ marginTop: 16, padding: '10px 16px', borderRadius: 8, background: '#111', color: '#fff' }}
          >
            {loading ? 'Starting…' : 'Subscribe'}
          </button>
        </main>
      </SignedIn>
    </>
  );
}
