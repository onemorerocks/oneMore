import Auth from '../backend/Auth';
import Email from '../backend/Email';
import SignupEmail from '../backend/SignupEmail.jsx';
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

  const sendVerificationEmail = (result, emailData, code) => {
    const key = result.emailVerificationKey;
    const html = ReactDOMServer.renderToStaticMarkup(<SignupEmail email={emailData} emailVerificationKey={key}/>);
    return emailService.sendEmail(emailData, 'Welcome to StickyBros', html).then(() => {
      return req.generateResponse().code(code);
    });
  };

  const promise = authService.signup(email, password, nickname).then((result) => {
    if (result.status === 'success' || result.status === 'resend') {
      return sendVerificationEmail(result, email, 200).then((response) => {
        response.header('Authorization', result.jwt);
        cookies.decorateJwt(response, result.jwt);
      });
    } else if (result.status === 'exists') {
      return req.generateResponse('This email is already verified!').code(409);
    } else if (result.status === 'weak-password') {
      return req.generateResponse('Bad password').code(403);
    } else if (result.status === 'email-password') {
      return req.generateResponse('Email password').code(499);
    } else if (result.status === 'resendPasswordMismatch') {
      return req.generateResponse('Password Mismatch').code(422);
    } else {
      throw new Error('Unexpected signup result', result);
    }
  });

  reply(promise);
}
