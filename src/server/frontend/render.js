import IsomorphicRouter from 'isomorphic-relay-router';
import DocumentTitle from 'react-document-title';
import Html from './Html.jsx';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from '../config';
import createHistory from 'history/lib/createHistory';
import constants from '../../../webpack/constants';
import { match } from 'react-router';
import getAssets from './assets';
import newError from '../backend/newError';
import routes from '../../routes';
import Relay from 'react-relay';

const assets = getAssets();
const appJsFilename = assets.js;
const appCss = assets.css;


const GRAPHQL_URL = 'http://localhost:8000/api/graphql';

function getAppHtml(renderProps) {
  return ReactDOMServer.renderToString(
    <IsomorphicRouter.RouterContext {...renderProps} />
  );
}

function getPageHtml(appHtml, hostname, preloadedData) {

  const appScriptSrc = config.isProduction ?
    `/_assets/${appJsFilename}` :
    `//${hostname}:${constants.HOT_RELOAD_PORT}/build/app.js`;

  const scriptHtml = `
    <script id="preloadedData" type="application/json">
        ${preloadedData}
    </script>
    <script src="${appScriptSrc}"></script>
  `;

  const title = DocumentTitle.rewind();

  const outputHtml = `<div id="app">${appHtml}</div>` + scriptHtml.trim();

  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
      <Html
        appCssHash={appCss}
        bodyHtml={outputHtml}
        isProduction={config.isProduction}
        title={title}
      />
    );
}

export default function render(req, reply) {
  const location = createHistory().createLocation(req.url.path);

  const promise = new Promise((resolve, reject) => {
    match({ routes, location }, (error, redirectLocation, renderProps) => {

      if (redirectLocation) {
        const response = req.generateResponse().redirect(302, redirectLocation.pathname + redirectLocation.search);
        resolve(response);
      } else if (error) {
        reject(newError(error));
      } else if (renderProps) {
        Relay.injectNetworkLayer(
          new Relay.DefaultNetworkLayer(GRAPHQL_URL, {
            headers: {
              token: req.state.token
            }
          })
        );
        const nestedPromise = IsomorphicRouter.prepareData(renderProps).then(({ data, props }) => {
          const appHtml = getAppHtml(props);
          return getPageHtml(appHtml, req.info.hostname, JSON.stringify(data));
        });
        resolve(nestedPromise);
      } else {
        const response = req.generateResponse('Not Found').code(404);
        resolve(response);
      }

    });
  });

  reply(promise.catch((error) => {
    throw newError(error);
  }));
}
