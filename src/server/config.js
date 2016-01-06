/* eslint-disable */

var config = require('configs');
var hashFile = require('hash-file');

var isProduction = process.env.NODE_ENV === 'production';

config.isProduction = isProduction;

config.piping = {
  // Ignore webpack custom loaders on server. TODO: Reuse index.js config.
  ignore: /(\/\.|~$|\.(css|scss))/,
  // Hook false ensures server is restarted only on server files change.
  // True would restart server on any file change, but it doesn't work with
  // hot reloading. This means browser reload will always get stale react
  // components which results to React attempted to reuse markup warning.
  // But that's fine, because with new react-transform we don't have to
  // reload browser during development anymore.
  hook: false
};

config.webpackStylesExtensions = ['css', 'scss'];

module.exports = config;
