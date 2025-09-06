// app/dashboard/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type AccountType = 'listener' | 'creator';
type Plan = 'free' | 'subscriber' | 'pro' | 'premium';

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as Record<string, unknown>;

  const accountType = (meta.accountType as AccountType) || 'listener';
  const plan = (meta.plan as Plan) || 'free';

  const name =
    (user?.firstName && user?.lastName && `${user.firstName} ${user.lastName}`) ||
    user?.firstName ||
    user?.username ||
    'Friend';

  // simple inline styles
  const wrap: React.CSSProperties = { maxWidth: 960, margin: '24px auto' };
  const card: React.CSSProperties = { border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 };
  const pill: React.CSSProperties = { display: 'inline-block', padding: '4px 10px', borderRadius: 999, border: '1px solid #111', fontSize: 12 };

  return (
    <main style={wrap}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Welcome back, {name}</h1>

      <section style={card}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <span style={pill}>{accountType.toUpperCase()}</span>
          <span style={pill}>PLAN: {plan.toUpperCase()}</span>
        </div>

        {accountType === 'creator' ? (
          <p>You’re a <strong>Creator</strong>. You can upload tracks, manage assets, and access creator tools.</p>
        ) : (
          <p>You’re a <strong>Listener</strong>. Browse, save favorites, and license tracks.</p>
        )}

        {plan === 'free' ? (
          <p style={{ color: '#555', marginTop: 12 }}>
            You’re on the <strong>Free</strong> plan. Upgrade to unlock HQ downloads and more.
          </p>
        ) : (
          <p style={{ color: '#16a34a', marginTop: 12 }}>✅ Active subscription — thanks for supporting PulseNexis!</p>
        )}
      </section>
    </main>
  );
}
