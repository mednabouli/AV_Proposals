import * as Sentry from "@sentry/nextjs";

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV || "development",
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      
      // Scrub sensitive data
      beforeSend(event) {
        if (event.request) {
          // Remove any auth tokens from request data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sanitizedRequest: any = { ...event.request };
          if (sanitizedRequest.cookies) {
            sanitizedRequest.cookies = { redacted: true };
          }
          if (sanitizedRequest.headers) {
            const sanitizedHeaders = { ...sanitizedRequest.headers };
            if (sanitizedHeaders.authorization) {
              sanitizedHeaders.authorization = "[REDACTED]";
            }
            sanitizedRequest.headers = sanitizedHeaders;
          }
          event.request = sanitizedRequest;
        }

        // Scrub user data
        if (event.user) {
          event.user = {
            id: event.user.id,
            // Don't include email or other PII
          };
        }

        // Scrub proposal and client data from breadcrumbs and contexts
        if (event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
            if (breadcrumb.data) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const sanitized: any = { ...breadcrumb.data };
              delete sanitized.client_name;
              delete sanitized.raw_brief;
              delete sanitized.client_company;
              delete sanitized.email;
              breadcrumb.data = sanitized;
            }
            return breadcrumb;
          });
        }

        return event;
      },
    });
  }
}

export function captureException(error: Error, context?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      contexts: context ? { extra: context } : undefined,
    });
  } else {
    console.error("Sentry not configured, logging error:", error);
  }
}

export function captureMessage(message: string, level: "fatal" | "error" | "warning" | "info" = "info") {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}
