import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.alicdn.com' },
      { protocol: 'https', hostname: 'ae01.alicdn.com' },
      { protocol: 'https', hostname: 'ae02.alicdn.com' },
      { protocol: 'https', hostname: 'ae03.alicdn.com' },
    ],
  },
};

export default nextConfig;
