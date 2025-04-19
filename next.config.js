const path = require("path");

module.exports = {
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
  // Add this to explicitly allow all hosts
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }
        ],
      },
    ];
  }
};