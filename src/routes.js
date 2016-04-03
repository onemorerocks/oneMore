import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from './client/app/App.jsx';
import { homeQuery } from './queries';
import Signup from './client/pages/Signup.jsx';
import Login from './client/pages/LoginPage.jsx';
import TabWrapper from './client/pages/TabWrapper.jsx';

export default (
  <Route path="/" component={App} queries={homeQuery}>
    <IndexRoute component={TabWrapper} queries={homeQuery} />
    <Route path="/signup" component={Signup} />
    <Route path="/login" component={Login} />
    <Route path="/guys" queries={homeQuery} component={TabWrapper} />
    <Route path="/guys/:profileId" queries={homeQuery} component={TabWrapper} />
    <Route path="/profile" queries={homeQuery} component={TabWrapper} />
  </Route>
);
