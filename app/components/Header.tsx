'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

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
  border: '1px solid #111',
} as const;

export default function Header() {
  return (
    <header style={{ padding: '24px 0', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
        {/* Brand */}
        <Link href="/" style={{ fontWeight: 600, fontSize: 24, color: '#111', textDecoration: 'none' }}>
          PulseNexis
        </Link>

        {/* Nav buttons centered */}
        <nav style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 12 }}>
          <SignedOut>
            <SignInButton mode="modal">
              <button style={pill}>Sign in</button>
            </SignInButton>
            <Link href="/sign-up" style={pillPrimary}>Join</Link>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard" style={pill}>Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
