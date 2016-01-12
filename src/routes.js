import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './client/app/app.react';
import HomeWrapper from './client/pages/HomeWrapper.jsx';
import {homeQuery} from './queries';
import Signup from './client/pages/signup.react';
import Login from './client/pages/LoginPage.jsx';

const getHome = (location, cb) => {
  cb(null, HomeWrapper);
};

export default (
  <Route path="/" component={App}>
    <IndexRoute getComponent={getHome} queries={homeQuery}/>
    <Route path="/signup" component={Signup}/>
    <Route path="/login" component={Login}/>
  </Route>
);
