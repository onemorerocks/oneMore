import DocumentTitle from 'react-document-title';
import Html from './html.react';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from '../config';
import createHistory from 'history/lib/createHistory';
import createRoutes from '../../client/createRoutes';
import constants from '../../../webpack/constants';
import {RoutingContext, match} from 'react-router';
import getAssets from './assets';

const assets = getAssets();
const appJsFilename = assets.js;
const appCss = assets.css;

export default function renderPage(req, reply) {
  const routes = createRoutes(req.state.grant);
  const location = createHistory().createLocation(req.url.path);

  const promise = new Promise((resolve, reject) => {
    match({routes, location}, (error, redirectLocation, renderProps) => {

      if (redirectLocation) {
        resolve(reply.redirect(redirectLocation.pathname + redirectLocation.search).permanent(true));
        return;
      }

      if (error) {
        resolve(reply(new Error('unexpect error')));
        return;
      }

      if (renderProps == null) {
        resolve(reply('The page was not found').code(404));
        return;
      }

      //const ua = useragent.is(req.headers['user-agent']);

      let appHtml = getAppHtml(renderProps);
      const html = getPageHtml(appHtml, req.info.hostname);
      resolve(html);
    });
  });

  reply(promise);
}

function getAppHtml(renderProps) {
  return ReactDOMServer.renderToString(
    <RoutingContext {...renderProps} />
  );
}

function getPageHtml(appHtml, hostname) {

  const appScriptSrc = config.isProduction
    ? `/_assets/${appJsFilename}`
    : `//${hostname}:${constants.HOT_RELOAD_PORT}/build/app.js`;

  const scriptHtml = `<script src="${appScriptSrc}"></script>`;

  const title = DocumentTitle.rewind();

  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
      <Html
        appCssHash={appCss}
        bodyHtml={`<div id="app">${appHtml}</div>` + scriptHtml}
        isProduction={config.isProduction}
        title={title}
        />
    );
}
