import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: '**',
      },
      {
        protocol: 'http' as const,
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
