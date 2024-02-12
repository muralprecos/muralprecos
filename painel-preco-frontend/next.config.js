/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  //output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  // experimental: {
  //   serverActions: true,
  // },
  env: {
    // pulls from .env file
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL,
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
