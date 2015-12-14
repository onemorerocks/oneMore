import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import createRoutes from './createRoutes';

const app = document.getElementById('app');

const routes = createRoutes();

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    {routes}
  </Router>,
  app
);
