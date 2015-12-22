import Auth from '../backend/auth';
import Email from '../backend/email';
import SignupEmail from '../backend/signupEmail.react';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const emailService = new Email();
const authService = new Auth();

export default function signupController(req, reply) {

  const email = req.payload.email;
  const password = req.payload.password;

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
    reply('Bad email length').code(500);
    return;
  }

  if (isBadLength(password, 'Password', 8, 100)) {
    reply('Bad password length').code(500);
    return;
  }

  const sendVerificationEmail = (result, code) => {
    const key = result.hash;
    const html = ReactDOMServer.renderToStaticMarkup(<SignupEmail hashedKey={key}/>);
    return emailService.sendEmail(email, 'Welcome to StickyBros', html).then(() => {
      return req.generateResponse().code(code);
    });
  };

  const promise = authService.signup(email, password).then((result) => {
    if (result.status === 'success') {
      return sendVerificationEmail(result, 200);
    } else if (result.status === 'exists') {
      return req.generateResponse('This email is already verified!').code(409);
    } else if (result.status === 'resend') {
      return sendVerificationEmail(result, 202);
    } else if (result.status === 'weak-password') {
      return req.generateResponse('Bad password').code(403);
    } else {
      throw new Error('Unexpected signup result', result);
    }
  });

  reply(promise);
}
