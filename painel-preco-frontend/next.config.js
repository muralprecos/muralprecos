// const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output : "standalone",
  // output: 'standalone',
  //output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  // experimental: {
  //   serverActions: true,
  // },
  generateBuildId: async () => {
    return `${Date.now() + Math.round(Math.random() * 2441139)}`;
  },
  env: {
    // pulls from .env file
    API_URL: process.env.API_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    KEYCLOAK_ID: process.env.KEYCLOAK_ID,
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
    GET_TOKEN_URL: process.env.GET_TOKEN_URL,
    REFRESH_TOKEN_URL: process.env.REFRESH_TOKEN_URL,
    END_SESSION_URL: process.env.END_SESSION_URL
  },
  webpack(config) {
    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.fallback = { fs: false };
    return config;
  }
};

module.exports = nextConfig
