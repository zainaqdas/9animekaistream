import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '9anime.org.lv',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.9anime.org.lv',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.wordpress.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.anilist.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
