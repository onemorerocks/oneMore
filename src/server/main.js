import Hapi from 'hapi';
import Inert from 'inert';
import Path from 'path';
import jwt from 'hapi-auth-jwt2';

import config from './config';
import render from './frontend/render';
import loginController from './api/loginController';
import signupController from './api/signupController';
import verifyEmailController from './api/verifyEmailController';
import brosController from './api/brosController';
import logoutController from './api/logoutController';

import Auth from './backend/auth';

const server = new Hapi.Server();
server.connection({port: config.port});

server.register([Inert, jwt], (error) => {

  if (error) {
    console.error(error); // eslint-disable-line
  }

  const auth = new Auth();

  server.auth.strategy('jwt', 'jwt', false, {
    key: auth.getJwtKey.bind(auth),
    validateFunc: auth.validateJwt.bind(auth),
    verifyOptions: {algorithms: ['HS256']}
  });

  server.route({
    method: 'POST',
    path: '/api/login',
    handler: loginController
  });

  server.route({
    method: 'POST',
    path: '/api/signup',
    handler: signupController
  });

  server.route({
    method: 'GET',
    path: '/api/bros',
    config: {auth: 'jwt'},
    handler: brosController
  });

  server.route({
    method: 'GET',
    path: '/api/logout',
    handler: logoutController
  });

  server.route({
    method: 'GET',
    path: '/email-verify/{param*}',
    handler: verifyEmailController
  });

  server.route({
    method: 'GET',
    path: '/assets/img/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, '../../assets/img')
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/_assets/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, '../../build')
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: render
  });

  server.ext('onPreResponse', (request, reply) => {

    const response = request.response;

    if (!response.isBoom) {
      reply.continue();
    } else if (response.message === 'Invalid token' || response.message === 'Missing authentication') {
      reply.continue();
    } else {
      console.error(response.stack); // eslint-disable-line
      reply(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Server Error</title>
          <link href="/_assets/app.css" rel="stylesheet"/>
      </head>
      <body>
        <div class="row">
          <h1>Sorry, there's been a server side error.</h1>
          <p><a href="/">Click here to go back home.</a></p>
        </div>
      </body>
      </html>`).code(500);
    }
  });

  server.start(() => {
    console.log('Server running at:', server.info.uri); // eslint-disable-line
  });

});
