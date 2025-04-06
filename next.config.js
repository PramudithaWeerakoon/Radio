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
};