import Auth from '../backend/auth';
import Email from '../backend/email';
import SignupEmail from '../backend/signupEmail.react';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cookies from '../backend/cookies';

const emailService = new Email();
const authService = new Auth();

export default function signupController(req, reply) {

  const email = req.payload.email;
  const password = req.payload.password;
  const nickname = req.payload.nickname;

  function isBadLength(value, name, min, max) {
    if (!value || value.length < min) {
      reply(`${name} too short`).code(500);
      return true;
    } else if (value.length > max) {
      reply(`${name} too long`).code(500);
      return true;
    }

    return false;
  }

  if (isBadLength(email, 'Email', 5, 100)) {
    return;
  }

  if (isBadLength(password, 'Password', 8, 100)) {
    return;
  }

  if (isBadLength(nickname, 'Nickname', 2, 20)) {
    return;
  }

  const sendVerificationEmail = (result, email, code) => {
    const key = result.emailVerificationKey;
    const html = ReactDOMServer.renderToStaticMarkup(<SignupEmail email={email} emailVerificationKey={key}/>);
    return emailService.sendEmail(email, 'Welcome to StickyBros', html).then(() => {
      return req.generateResponse().code(code);
    });
  };

  const promise = authService.signup(email, password, nickname).then((result) => {
    if (result.status === 'success') {
      return sendVerificationEmail(result, email, 200).then((response) => {
        response.header('Authorization', result.jwt);
        cookies.decorateJwt(response, result.jwt);
        cookies.decorateGrant(response, false);
      });
    } else if (result.status === 'exists') {
      return req.generateResponse('This email is already verified!').code(409);
    } else if (result.status === 'resend') {
      return sendVerificationEmail(result, email, 202);
    } else if (result.status === 'weak-password') {
      return req.generateResponse('Bad password').code(403);
    } else {
      throw new Error('Unexpected signup result', result);
    }
  });

  reply(promise);
}
