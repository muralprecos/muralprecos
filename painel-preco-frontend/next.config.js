/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  //output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  experimental: {
    serverActions: true,
  },
  webpack(config) {
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  }
};

module.exports = nextConfig
