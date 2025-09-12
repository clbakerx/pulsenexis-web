import Link from "next/link";

export default function Page() {
  return (
    <main className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Welcome to PulseNexis 🚀</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Welcome—feel free to enjoy Honey Drip Records music…
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/plans"
          className="rounded-xl bg-black text-white px-4 py-2 text-sm shadow-md hover:opacity-90 dark:bg-white dark:text-black"
        >
          Browse Plans
        </Link>
        <Link
          href="/Manage Account"
          className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          Go to Account
        </Link>
      </div>
    </main>
  );
}
