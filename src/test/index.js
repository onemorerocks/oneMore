// Browser ES6 Polyfill
require('babel/polyfill');

const testsContext = require.context('.', true, /spec.js$/);
testsContext.keys().forEach(testsContext);
