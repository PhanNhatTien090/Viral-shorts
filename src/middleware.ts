import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes - these require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/history(.*)',
  '/library(.*)',
  '/settings(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect specific routes, leave others PUBLIC
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  // Public routes: /, /api/generate, /templates, etc.
  // These are accessible without login
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
