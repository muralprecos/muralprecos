const { version } = require('./package.json');

const appEnvironment =
  process.env.NEXT_PUBLIC_APP_ENV ??
  (process.env.NODE_ENV === 'development' ? 'development' : 'production');

const nextConfig = {
  output: "standalone",
  generateBuildId: async () => {
    return `${Date.now() + Math.round(Math.random() * 2441139)}`;
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_APP_ENV: appEnvironment,
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
