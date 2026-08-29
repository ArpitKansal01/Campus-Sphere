import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  experimental: {
    turbopack: {
      root: "c:/Users/Asus/Desktop/Projects/Campus-Sphere",
    },
  },
};

export default nextConfig;
