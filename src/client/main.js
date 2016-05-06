import { browserHistory, match, Router } from 'react-router';
import IsomorphicRouter from 'isomorphic-relay-router';
import IsomorphicRelay from 'isomorphic-relay';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import errorReporting from './lib/errorReporting';
import routes from '../routes';

errorReporting();

const environment = new Relay.Environment();
environment.injectNetworkLayer(new Relay.DefaultNetworkLayer('/api/graphql', {
  credentials: 'same-origin'
}));

const data = JSON.parse(document.getElementById('preloadedData').textContent);

IsomorphicRelay.injectPreparedData(environment, data);

const rootElement = document.getElementById('app');

match({ routes, history: browserHistory }, (error, redirectLocation, renderProps) => {
  IsomorphicRouter.prepareInitialRender(environment, renderProps).then(props => {
    ReactDOM.render(<Router {...props} />, rootElement);
  });
});

