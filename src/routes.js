import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from './client/app/App.jsx';
import HomeWrapper from './client/pages/HomeWrapper.jsx';
import { homeQuery } from './queries';
import Signup from './client/pages/Signup.jsx';
import Login from './client/pages/LoginPage.jsx';
import Profile from './client/pages/Profile.jsx';
import ProfileImages from './client/pages/ProfileImages.jsx';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomeWrapper} queries={homeQuery}/>
    <Route path="/signup" component={Signup}/>
    <Route path="/login" component={Login}/>
    <Route path="/profile" queries={homeQuery} component={Profile}/>
    <Route path="/profile/images" queries={homeQuery} component={ProfileImages}/>
  </Route>
);
