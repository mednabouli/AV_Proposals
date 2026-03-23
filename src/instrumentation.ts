/**
 * Instrumentation file - runs in Node.js runtime (not Edge Runtime)
 * This is the proper place to initialize Sentry and other SDKs
 * that cannot run in Vercel's Edge Runtime middleware
 *
 * Reference: https://nextjs.org/docs/app-api-reference/file-conventions/instrumentation
 */

export async function register() {
  // Initialize Sentry only if DSN is configured
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Dynamically import to avoid loading in Edge Runtime
    const { initSentry } = await import("@/lib/sentry/config");
    initSentry();
  }
}
