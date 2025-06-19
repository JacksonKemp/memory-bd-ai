import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
  },
  experimental: {
    serverComponentsExternalPackages: ['googleapis'],
  },
};

export default nextConfig;
