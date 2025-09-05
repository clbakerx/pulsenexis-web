import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="p-10">
      <SignIn
        routing="path"
        path="/sign-in"
        afterSignInUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </main>
  );
}
