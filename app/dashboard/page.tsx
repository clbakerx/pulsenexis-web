"use client";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <SignedIn>
        <main className="p-6">Your dashboard content here</main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
