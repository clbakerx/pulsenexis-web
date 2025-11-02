'use client';
import { SignIn } from '@clerk/nextjs';
import Header from '../../components/Header';

export default function SignInPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Sign in to your PulseNexis account
            </p>
          </div>
          
          <SignIn
            routing="path"
            path="/sign-in"
            fallbackRedirectUrl="/dashboard"
            forceRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg border-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border border-neutral-200 hover:bg-neutral-50",
                formButtonPrimary: "bg-black hover:bg-neutral-800 text-white",
                footerActionLink: "text-black hover:text-neutral-600"
              }
            }}
          />
        </div>
      </main>
    </>
  );
}
