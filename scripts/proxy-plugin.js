/* eslinit-disable */
const { createPlugin } = require('docz-core');
const proxy = require('http-proxy-middleware');

const proxyPlugin = () =>
  createPlugin({
    onPreCreateApp: (app) => {
      app.use(
        '/api',
        proxy({
          target: 'http://localhost:5000',
        }),
      ); 
    },
  });

module.exports = proxyPlugin;
