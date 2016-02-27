import { browserHistory } from 'react-router';
import IsomorphicRelay from 'isomorphic-relay';
import IsomorphicRouter from 'isomorphic-relay-router';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import errorReporting from './lib/errorReporting';
import routes from '../routes';

errorReporting();

Relay.injectNetworkLayer(new Relay.DefaultNetworkLayer('/api/graphql', {
  credentials: 'same-origin'
}));

const data = JSON.parse(document.getElementById('preloadedData').textContent);

IsomorphicRelay.injectPreparedData(data);

const app = document.getElementById('app');

ReactDOM.render(
  <IsomorphicRouter.Router routes={routes} history={browserHistory}/>,
  app
);
