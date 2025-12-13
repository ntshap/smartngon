import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set turbopack root to resolve multiple lockfiles in monorepo
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "hoirqrkdgbmvpwutwuwj.supabase.co",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;
