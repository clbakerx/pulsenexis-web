'use client';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <SignIn
      routing="path"
      path="/sign-in"
      // optional redirects:
      fallbackRedirectUrl="/dashboard"
      forceRedirectUrl="/dashboard"
    />
  );
}
