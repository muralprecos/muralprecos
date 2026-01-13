const nextConfig = {
  output: "standalone",
  generateBuildId: async () => {
    return `${Date.now() + Math.round(Math.random() * 2441139)}`;
  },
  env: {
    API_URL: process.env.API_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    KEYCLOAK_ID: process.env.KEYCLOAK_ID,
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
    GET_TOKEN_URL: process.env.GET_TOKEN_URL,
    REFRESH_TOKEN_URL: process.env.REFRESH_TOKEN_URL,
    END_SESSION_URL: process.env.END_SESSION_URL,
    CHECK_SESSION_URL: process.env.CHECK_SESSION_URL,
    KEYCLOAK_SECRET: process.env.KEYCLOAK_SECRET,
  },
  turbopack: {},
  compiler: {
    styledComponents: true,
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=9999999999, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
