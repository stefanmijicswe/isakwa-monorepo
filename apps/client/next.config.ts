import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: [
      'localhost:3000',
      'localhost:3001',
      '192.168.100.12:3000',
      '192.168.100.12:3001'
    ],
  },
};

export default nextConfig;
