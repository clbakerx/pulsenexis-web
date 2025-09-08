import Link from "next/link";
import type { CSSProperties } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/dashboard");

  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as Record<string, unknown>;
  type Plan = "free" | "subscriber" | "pro" | "premium";
  const plan = (meta.plan as Plan) || "free";

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
      {/* Probably show Upgrade when NOT premium */}
      {plan !== "premium" && (
        <Link href="/checkout" style={btn} prefetch={false}>
          Upgrade
        </Link>
      )}
    </main>
  );
}
