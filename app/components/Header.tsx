'use client';

import Link from 'next/link';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs';

const pill = {
  padding: '10px 16px',
  borderRadius: '9999px',
  border: '1px solid #111',
  background: 'transparent',
  cursor: 'pointer',
} as const;

const pillPrimary = {
  ...pill,
  background: '#111',
  color: '#fff',
} as const;

export default function Header() {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 24px 0',
        maxWidth: '960px',
        margin: '0 auto',
      }}
    >
      {/* Logo / title */}
      <Link
        href="/"
        style={{
          fontSize: '20px',
          fontWeight: 600,
          textDecoration: 'none',
          color: '#111',
        }}
      >
        PulseNexis — v6
      </Link>

      {/* Right-side nav */}
      <nav
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        {/* Always-visible plans link */}
        <Link href="/plans" style={pill}>
          Browse Plans
        </Link>

        <SignedIn>
          {/* Explicit manage link that goes to the Clerk account/billing UI */}
          <Link href="/plans" style={pill}>
            Manage Account
          </Link>

          {/* Avatar menu – its “Manage account” item also goes to /plans */}
          <UserButton
            afterSignOutUrl="/"
            userProfileMode="navigation"
            userProfileUrl="/plans"
          />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button style={pillPrimary}>Sign in</button>
          </SignInButton>
        </SignedOut>
      </nav>
    </header>
  );
}
