import Link from "next/link";
import Header from "../components/Header";

export default function PlansPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight">Choose Your Plan</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Start your journey with PulseNexis today
            </p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Monthly Plan */}
            <div className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <h2 className="text-xl font-semibold">Monthly</h2>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-neutral-600 dark:text-neutral-400">/month</span>
                </div>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Perfect for getting started
                </p>
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full platform access
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  24/7 Support
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cancel anytime
                </li>
              </ul>

              <Link
                href="/checkout?period=month"
                className="mt-6 block w-full text-center rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Annual Plan */}
            <div className="border rounded-xl p-6 hover:shadow-lg transition-shadow relative">
              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-semibold">Annual</h2>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$99</span>
                  <span className="text-neutral-600 dark:text-neutral-400">/year</span>
                </div>
                <p className="mt-2 text-sm text-green-600 font-medium">
                  Save $20 per year
                </p>
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full platform access
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  24/7 Support
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cancel anytime
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
              </ul>

              <Link
                href="/checkout?period=annual"
                className="mt-6 block w-full text-center rounded-xl bg-black text-white px-4 py-2 text-sm shadow-md hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* FAQ or additional info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Have questions? <Link href="/dashboard" className="text-black hover:underline">Contact support</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
