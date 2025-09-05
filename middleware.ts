// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public paths: everything else will require auth()
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;   // allow public routes
  auth().protect();                 // protect everything else
});

// Exclude Next internals and static assets; include API
export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/",
    "/api/(.*)",
  ],
};
