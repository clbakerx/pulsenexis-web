// middleware.ts  (Clerk v6+ / App Router)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Mark routes that DO NOT require auth (public)
const isPublicRoute = createRouteMatcher([
  "/",
  "/plans",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/catalog(.*)",
  "/api/health",          // example public API – remove if not needed
]);

export default clerkMiddleware(async (auth, req) => {
  // Check if the route requires authentication
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    
    // If not authenticated, redirect to sign-in
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  return NextResponse.next();
});

export const config = {
  // Skip Next.js internals and static files
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};
