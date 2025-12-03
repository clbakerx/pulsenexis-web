"use client";

import Header from "../components/Header";
import { UserProfile, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function PlansPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-16 flex justify-center">
        <SignedIn>
          {/* Use hash routing so Clerk stays on /plans and uses #tabs instead */}
          <UserProfile routing="hash" />
        </SignedIn>

        <SignedOut>
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">
              Sign in to manage your plan
            </h1>
            <p className="mb-6 text-sm text-neutral-600">
              You need an account to view billing and subscriptions.
            </p>
            <SignInButton mode="modal">
              <button className="rounded-xl bg-black text-white px-4 py-2 text-sm">
                Sign in
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </main>
    </>
  );
}
