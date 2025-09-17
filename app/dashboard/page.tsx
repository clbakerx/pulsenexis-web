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
  if (!userId) redirect(`/sign-in?redirect_url=${encodeURIComponent("/dashboard")}`);

  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as Record<string, unknown>;
  const plan: Plan = isPlan(meta.plan) ? meta.plan : "free";

  const btn: CSSProperties = { padding: "10px 16px", borderRadius: 8, background: "#111", color: "#fff", textDecoration: "none", display: "inline-block" };

  return (
    <main style={{ maxWidth: 960, margin: "24px auto" }}>
      <h1>Dashboard</h1>
      <p>Your plan: <b>{plan}</b></p>
      {plan !== "premium" && (
        <Link href="/plans" style={btn}>Upgrade</Link>
      )}
    </main>
  );
}
