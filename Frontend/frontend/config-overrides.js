const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = function override(config, env) {
  // Add the Workbox Webpack plugin to generate the service worker
  config.plugins.push(
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    })
  );

  return config;
};
