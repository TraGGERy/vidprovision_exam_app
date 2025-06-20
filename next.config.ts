import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Configure Turbopack
    resolveAlias: {
      // Add any aliases if needed
    }
  }
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development"
});

export default pwaConfig(nextConfig);
