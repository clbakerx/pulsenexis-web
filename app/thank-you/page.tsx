import Header from "../components/Header";
import Link from "next/link";

export default function ThankYou() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-4">Thank you!</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-2">
            Your subscription is active. You'll receive an email receipt shortly.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
            Welcome to PulseNexis! You now have full access to all features.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="rounded-xl bg-black text-white px-6 py-3 text-sm font-medium shadow-md hover:opacity-90 transition-opacity"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="rounded-xl border px-6 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
