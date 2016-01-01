import base64 from 'base64';

import App from './app/app.react';

import Home from './pages/Home.react';
import SignedInHome from './pages/SignedInHome.react';
import GridTest from './pages/gridtest.react';
import SignupIndex from './pages/signup.react';
import EmailSent from './pages/emailSent.react';

import NotFound from './pages/notFound.react';
import React from 'react';
import {IndexRoute, Route} from 'react-router';

const getCookie = (name) => {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export default function createRoutes(grants) {

  const getHome = (location, cb) => {

    let useGrants = grants;
    if (process.env.IS_BROWSER) {
      useGrants = getCookie('grant');
    }

    if (useGrants) {
      const decodedGrants = JSON.parse(base64.atob(useGrants));
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
      <Route component={NotFound} path="*"/>
    </Route>
  );

}
