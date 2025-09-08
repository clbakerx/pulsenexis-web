import Link from "next/link";
import type { CSSProperties } from "react";

export default function DashboardPage() {
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
      {/* …your existing UI… */}

      {plan === "premium" && (
        <Link href={checkoutHref} style={btn} prefetch={false}>
          Upgrade
        </Link>
      )}
    </main>
  );
}
