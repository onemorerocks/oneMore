import App from './app/app.react';
import Home from './pages/home.react';
import GridTest from './pages/gridtest.react';
import SignupIndex from './pages/signup.react';
import LoginIndex from './pages/login.react';
import NotFound from './pages/notFound.react';
import React from 'react';
import {IndexRoute, Route} from 'react-router';

export default function createRoutes() {

  return (
    <Route component={App} path="/">
      <IndexRoute component={Home} />
      <Route component={GridTest} path="gridtest"/>
      <Route component={SignupIndex} path="signup"/>
      <Route component={LoginIndex} path="login"/>
      <Route component={NotFound} path="*"/>
    </Route>
  );

}
