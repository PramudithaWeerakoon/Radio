const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Webpack customization
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });

    config.resolve.alias[".prisma/client"] = path.resolve(
      __dirname,
      "node_modules/.prisma/client"
    );

    return config;
  },

  // ✅ CORS Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }
        ],
      },
    ];
  },

  // ✅ Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
