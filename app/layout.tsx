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
      // send users to Clerk’s hosted pages on your accounts subdomain
      signInUrl="https://accounts.pulsenexis.com/sign-in"
      signUpUrl="https://accounts.pulsenexis.com/sign-up"
      // where to go after sign out (your marketing site or app home)
      afterSignOutUrl="https://pulsenexis.com"
    >
      <html lang="en">
        <body>
          {/* Optional: <Header /> (client component shown below) */}
          {children}
        </body>
      </html>
    </ClerkP
