import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/neural.html',
      },
    ];
  },
};

export default nextConfig;
