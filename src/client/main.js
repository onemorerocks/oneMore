import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import createRoutes from './createRoutes';
//import airbrakeJs from 'airbrake-js';

const AirbrakeClient = require('airbrake-js');

const airbrake = new AirbrakeClient();
airbrake.setHost('http://192.168.99.100:5000');
airbrake.setProject('105cd6c8fb856a26f8ab0fa2f866337a', '105cd6c8fb856a26f8ab0fa2f866337a');

airbrake.notify({error: {message: 'test'}});

const app = document.getElementById('app');

const routes = createRoutes();

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    {routes}
  </Router>,
  app
);
