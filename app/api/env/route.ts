export async function GET() {
  const envDump = {
    hasNEXT_PUBLIC: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    hasCLERK_PK: !!process.env.CLERK_PUBLISHABLE_KEY,
    cwd: process.cwd(),
  };
  return new Response(JSON.stringify(envDump, null, 2), {
    headers: { "content-type": "application/json" },
  });
}