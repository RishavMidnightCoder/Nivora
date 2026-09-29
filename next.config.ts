const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/backend/:path*", destination: `${BACKEND_URL}/:path*` },
    ];
  },
};
