// app/dashboard/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/nextjs';

const checkoutHref = '/checkout'; // maps to app/checkout/page.tsx

function DashboardClient() {
  const { user } = useUser();
  const meta = (user?.publicMetadata ?? {}) as Record<string, unknown>;

  type AccountType = 'listener' | 'creator';
  type Plan = 'free' | 'subscriber' | 'pro' | 'premium';

  const accountType = (meta.accountType as AccountType) || 'listener';
  const plan = (meta.plan as Plan) || 'free';

  const btn: React.CSSProperties = { padding: '10px 16px', borderRadius: 8, background: '#111', color: '#fff', textDecoration: 'none', display: 'inline-block' };

  return (
    <main style={{ maxWidth: 960, margin: '24px auto' }}>
      {/* …your existing UI… */}
      {plan !== 'premium' && (
        <Link href={checkoutHref} style={btn} prefetch>
          Upgrade to Premium
        </Link>
      )}
