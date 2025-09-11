import Link from "next/link";
import type { CSSProperties } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Plan = "free" | "subscriber" | "pro" | "premium";
const PLANS = ["free", "subscriber", "pro", "premium"] as const;
const isPlan = (v: unknown): v is Plan =>
  typeof v === "string" && (PLANS as readonly string[]).includes(v);

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    const url = `/sign-in?redirect_url=${encodeURIComponent("/dashboard")}`;
    redirect(url);
  }

  const user = await currentUser(); // can be null in edge cases
  const meta = (user?.publicMetadata ?? {}) as Record<string, unknown>;

  const plan: Plan = isPlan(meta.plan) ? meta.plan : "free";

  const btn: CSSProperties = {
    padding: "10px 16px",
    borderRadius: 8,
    background: "#111",
    color: "#fff",
    textDecoration: "none",
    display: "inline-block",
  };

  return (
    <main style={{ maxWidth: 960, margin: "24px auto" }}>
      {/* …your UI… */}
      {/* Show Upgrade when NOT premium */}
      {plan !== "premium" && (
        <Link href="/account" className="rounded px-4 py-2 border">
        Manage account
        </Link>
      )}
    </main>
  );
}
