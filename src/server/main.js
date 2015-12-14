import Hapi from 'hapi';
import Inert from 'inert';
//import Poop from 'poop';
import Path from 'path';
import jwt from 'hapi-auth-jwt2';

import config from './config';
import render from './frontend/render';
import loginController from './api/loginController';
import signupController from './api/signupController';

import Auth from './backend/auth';

const server = new Hapi.Server();
server.connection({port: config.port});

server.register([Inert, jwt], (error) => {

  if (error) {
    console.log(error); // eslint-disable-line
  }

  const auth = new Auth();

  server.auth.strategy('jwt', 'jwt', {
    key: 'NeverShareYourSecret',
    validateFunc: auth.validate,
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

  server.start(() => {
    console.log('Server running at:', server.info.uri); // eslint-disable-line
  });

});
