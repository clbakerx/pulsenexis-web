import Link from "next/link";

export default function Page() {
  return (
    <main className="container mx-auto px-6 py-16">
     <h1 className="text-3xl font-bold tracking-tight">PulseNexis — v6</h1>

      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        This text comes from <code>app/page.tsx</code>. If you can read this on the site, your live deploy worked.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/plans"
          className="rounded-xl bg-black text-white px-4 py-2 text-sm shadow-md hover:opacity-90 dark:bg-white dark:text-black"
        >
          Browse Plans
        </Link>

        {/* If you have a real /account page, change href to "/account" */}
        <Link
          href="/dashboard"
          className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          Go to Account
        </Link>
      </div>
    </main>
  );
}
