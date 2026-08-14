import type { NextConfig } from "next";

export const TABULAR_API_URL =
  process.env.TABULAR_API_URL || "http://127.0.0.1:8005";

const nextConfig: NextConfig = {
  // Standalone output for Docker deployment
  output: "standalone",
  // Prevent Next.js from stripping trailing slashes on proxied routes,
  // which causes redirect loops with Flask (Flask adds trailing slash,
  // Next.js removes it → 308 loop).
  skipTrailingSlashRedirect: true,
  compress: true,
};

export default nextConfig;
