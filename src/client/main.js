import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import createRoutes from './createRoutes';

const app = document.getElementById('app');

const getCookie = (name) => {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const routes = createRoutes(getCookie('grant'));

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    {routes}
  </Router>,
  app
);
