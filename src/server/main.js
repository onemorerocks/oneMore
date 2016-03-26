import Hapi from 'hapi';
import Inert from 'inert';
import Path from 'path';

import config from './config';
import render from './frontend/render';
import loginController from './api/loginController';
import signupController from './api/signupController';
import verifyEmailController from './api/verifyEmailController';
import logoutController from './api/logoutController';
import graphqlController from './api/graphqlController';
import { photosControllerPost, photosControllerGet } from './api/photosController';

const server = new Hapi.Server();
server.connection({ port: config.port });

server.register([Inert], (error) => {

  if (error) {
    console.error(error); // eslint-disable-line
  }

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
    path: '/api/logout',
    handler: logoutController
  });

  server.route({
    method: 'GET',
    path: '/email-verify/{param*}',
    handler: verifyEmailController
  });

  server.route({
    method: 'POST',
    path: '/api/graphql',
    handler: graphqlController
  });

  server.route({
    method: 'POST',
    path: '/api/photos',
    handler: photosControllerPost,
    config: {
      payload: {
        maxBytes: 5242880,
        output: 'stream'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/photos/{hash}',
    handler: photosControllerGet
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
    } else if ((response.output && response.output.statusCode === 404) ||
      response.message === 'Invalid token' ||
      response.message === 'Missing authentication') {
      reply.continue();
    } else {
      console.error(response.stack); // eslint-disable-line
      reply(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Server Error</title>
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
