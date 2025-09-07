// app/dashboard/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/nextjs';

type AccountType = 'listener' | 'creator';
type Plan = 'free' | 'subscriber' | 'pro' | 'premium';

const checkoutPath = '/checkout'; // <-- change if your checkout URL is different

function DashboardClient() {
  const { user } = useUser();
  const meta = (user?.publicMetadata ?? {}) as Record<string, unknown>;

  const accountType = (meta.accountType as AccountType) || 'listener';
  const plan = (meta.plan as Plan) || 'free';

  const name =
    (user?.firstName && user?.lastName && `${user.firstName} ${user.lastName}`) ||
    user?.firstName ||
    user?.username ||
    'Friend';

  // simple inline styles
  const wrap: React.CSSProperties = { maxWidth: 960, margin: '24px auto' };
  const card: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 20,
    display: 'grid',
    gap: 12,
  };
  const pill: React.CSSProperties = { display: 'inline-block', padding: '4px 10px', borderRadius: 999, border: '1px solid #111', fontSize: 12 };
  const btn: React.CSSProperties = { padding: '10px 16px', borderRadius: 8, background: '#111', color: '#fff', textDecoration: 'none', display: 'inline-block' };
  const ghostBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: 8, border: '1px solid #111', color: '#111', textDecoration: 'none', display: 'inline-block', background: 'transparent' };
  const ok: React.CSSProperties = { color: '#16a34a' }; // green
  const no: React.CSSProperties = { color: '#9ca3af' }; // gray

  // compute next action
  const showUpgrade = plan !== 'premium';
  const upgradeHref = `${checkoutPath}?from=dashboard&plan=${encodeURIComponent('premium')}&current=${encodeURIComponent(plan)}`;
  const manageHref = '/billing'; // if you have a billing portal, adjust or remove

  return (
    <main style={wrap}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Welcome back, {name}</h1>

      <section style={card}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={pill}>{accountType.toUpperCase()}</span>
          <span style={pill}>PLAN: {plan.toUpperCase()}</span>
        </div>

        {/* Role description */}
        {accountType === 'creator' ? (
          <p>
            You’re a <strong>Creator</strong>. Upload tracks, manage your catalog, and access licensing tools.
          </p>
        ) : (
          <p>
            You’re a <strong>Listener</strong>. You can listen to tracks and bookmark your favorites.
          </p>
        )}

        {/* Capabilities list (simple demo matrix) */}
        <div>
          <strong>Capabilities</strong>
          <ul style={{ marginTop: 8, lineHeight: 1.7 }}>
            <li><span style={ok}>✓</span> Stream full tracks</li>
            <li><span style={ok}>✓</span> Bookmark favorites</li>
            <li>
              <span style={plan === 'free' ? no : ok}>{plan === 'free' ? '•' : '✓'}</span>{' '}
              Ad-free listening
            </li>
            <li>
              <span style={['pro', 'premium'].includes(plan) ? ok : no}>
                {['pro', 'premium'].includes(plan) ? '✓' : '•'}
              </span>{' '}
              Licensing & downloads
            </li>
            {accountType === 'creator' && (
              <>
                <li><span style={ok}>✓</span> Upload & manage catalog</li>
                <li>
                  <span style={plan === 'premium' ? ok : no}>{plan === 'premium' ? '✓' : '•'}</span>{' '}
                  Analytics & advanced tools
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Call to action */}
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          {showUpgrade ? (
            <Link href={upgradeHref} style={btn} prefetch>
              Upgrade to Premium
            </Link>
          ) : (
            <span style={{ ...pill, borderColor: '#16a34a', color: '#16a34a' }}>PREMIUM ACTIVE</span>
          )}

          {/* Optional: give users a way to manage/cancel if already paid */}
          {!showUpgrade && (
            <Link href={manageHref} style={ghostBtn} prefetch>
              Manage billing
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <>
      <SignedIn>
        <DashboardClient />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
