// app/layout.tsx
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'PulseNexis',
  description: 'Original R&B/Soul songs for licensing',
  metadataBase: new URL('https://app.pulsenexis.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
