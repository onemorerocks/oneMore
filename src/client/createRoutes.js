import base64 from 'base64';

import App from './app/app.react';

import Home from './pages/home.react';
import SignedInHome from './pages/SignedInHome.react';
import GridTest from './pages/gridtest.react';
import SignupIndex from './pages/signup.react';
import LoginIndex from './pages/login.react';
import EmailSent from './pages/emailSent.react';

import NotFound from './pages/notFound.react';
import React from 'react';
import {IndexRoute, Route} from 'react-router';

export default function createRoutes(grants) {

  const getHome = (location, cb) => {
    if (grants) {
      const decodedGrants = JSON.parse(base64.atob(grants));
      if (decodedGrants.emailValidated) {
        cb(null, SignedInHome);
      } else {
        cb(null, EmailSent);
      }
      return;
    }
    cb(null, Home);
  };

  return (
    <Route component={App} path="/">
      <IndexRoute getComponent={getHome}/>
      <Route component={GridTest} path="gridtest"/>
      <Route component={SignupIndex} path="signup"/>
      <Route component={LoginIndex} path="login"/>
      <Route component={NotFound} path="*"/>
    </Route>
  );

}
