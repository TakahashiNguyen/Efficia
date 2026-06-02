import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  turbopack: {},
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development to avoid caching issues
})(nextConfig);
