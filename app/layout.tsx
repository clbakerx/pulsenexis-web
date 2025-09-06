// app/layout.tsx
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'PulseNexis',
  description: 'Original R&B/Soul songs for licensing',
  metadataBase: new URL('https://app.pulsenexis.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      // using hosted auth on accounts.pulsenexis.com
      signInUrl="https://accounts.pulsenexis.com/sign-in"
      signUpUrl="https://accounts.pulsenexis.com/sign-up"
      afterSignOutUrl="https://pulsenexis.com"
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
