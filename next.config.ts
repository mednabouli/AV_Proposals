import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Clerk middleware is configured in src/middleware.ts
  // This pattern is required for authentication and cannot use the new proxy pattern
};

export default nextConfig;
