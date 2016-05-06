require('babel-register'); // eslint-disable-line
require('babel-polyfill'); // eslint-disable-line

const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const config = require('./config');
const rootDir = require('path').resolve(__dirname, '..', '..');
const webpackIsomorphicAssets = require('../../webpack/assets').default;

if (!process.env.NODE_ENV) {
  throw new Error(
    'Environment variable NODE_ENV must be set to development or production.'
  );
}

global.webpackIsomorphicTools = new WebpackIsomorphicTools(webpackIsomorphicAssets)
  .development(!config.isProduction)
  .server(rootDir, () => {
    require('./main'); // eslint-disable-line
  });
