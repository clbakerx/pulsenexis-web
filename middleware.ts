// middleware.ts  (Clerk v5+ / App Router)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Mark routes that DO NOT require auth (public)
// Flip the list if you prefer to list the protected ones instead.
const isPublicRoute = createRouteMatcher([
  "/",
  "/catalog(.*)",
  "/api/health",          // example public API – remove if not needed
]);

export default clerkMiddleware((auth, req) => {
  // Protect everything that isn't in isPublicRoute
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  // Skip Next.js internals and static files
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};
