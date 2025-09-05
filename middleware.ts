// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protect only private areas
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/checkout(.*)',
  '/account(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

// Skip Next internals, static assets, webhooks, and Clerk hosted pages
export const config = {
  matcher: [
    '/((?!_next|favicon.ico|robots.txt|sitemap.xml|images|assets|public|api/webhooks|sign-in|sign-up|.*\\.(?:png|jpg|jpeg|svg|gif|ico|css|js|map|txt|woff|woff2|ttf)).*)',
  ],
};
