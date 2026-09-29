import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/+$/, "");

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not set");
}

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      // keep the trailing slash when the browser sends one
      {
        source: "/backend/:path*/",
        destination: `${BACKEND_URL}/:path*/`,
      },
      {
        source: "/backend/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
