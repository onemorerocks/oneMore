/* eslint-disable */

var config = require('configs');

var isProduction = process.env.NODE_ENV === 'production';

config.isProduction = isProduction;

module.exports = config;
