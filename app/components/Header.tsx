'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="p-6 border-b">
      <div className="max-w-3xl mx-auto text-center">
        {/* Brand centered */}
        <Link href="/" className="font-semibold text-2xl">PulseNexis</Link>

        {/* Nav centered with bigger buttons */}
        <nav className="mt-4 flex items-center justify-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-5 py-2 rounded-full border hover:shadow">
                Sign in
              </button>
            </SignInButton>
            <Link
              href="/sign-up"
              className="px-5 py-2 rounded-full bg-black text-white hover:opacity-90"
            >
              Join
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="px-5 py-2 rounded-full border hover:shadow"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
