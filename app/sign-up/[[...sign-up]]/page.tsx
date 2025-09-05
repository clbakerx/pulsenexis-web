import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="p-10">
      <SignUp
        routing="path"
        path="/sign-up"
        afterSignUpUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </main>
  );
}
