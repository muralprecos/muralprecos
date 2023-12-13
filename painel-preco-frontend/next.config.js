/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack(config) {
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  }
};

module.exports = nextConfig
