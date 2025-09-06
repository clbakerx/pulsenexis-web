'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="p-4 border-b flex items-center gap-3">
      <Link href="/" className="font-semibold text-xl">PulseNexis</Link>

      <nav className="ml-auto flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-3 py-1 border rounded">Sign in</button>
          </SignInButton>
          <Link className="px-3 py-1 border rounded" href="/sign-up">Join</Link>
        </SignedOut>

        <SignedIn>
          <Link className="px-3 py-1 border rounded" href="/dashboard">Dashboard</Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>
    </header>
  );
}
