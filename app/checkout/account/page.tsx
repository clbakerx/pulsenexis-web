// app/account/page.tsx
"use client";
import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return <UserProfile routing="path" path="/account" />;
}
