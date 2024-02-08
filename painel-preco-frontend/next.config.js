/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  //output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  // experimental: {
  //   serverActions: true,
  // },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET, // pulls from .env file
  },
  webpack(config) {
    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.fallback = { fs: false };
    return config;
  }
};

module.exports = nextConfig
