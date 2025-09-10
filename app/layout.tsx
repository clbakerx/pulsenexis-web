import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEYpk_test_ZW5oYW5jZWQtd2Vhc2VsLTEuY2xlcmsuYWNjb3VudHMuZGV2JA}>
      <html lang="en"><body>{children}</body></html>
    </ClerkProvider>
  );
}
