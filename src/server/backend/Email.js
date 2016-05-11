import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import config from '../config';
import newError from './newError';

export default class Email {

  constructor() {

    this.transporter = nodemailer.createTransport(smtpTransport({
      host: config.emailHost,
      port: config.emailPort,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    }));

  }

  sendEmail(to, subject, html) {
    return new Promise((resolve) => {

      if (!config.sendEmails) {
        resolve(false);
        return;
      }

      this.transporter.sendMail({
        from: config.emailFrom,
        to,
        subject,
        generateTextFromHTML: true,
        html
      }, (error, response) => {
        if (error) {
          throw newError(error);
        } else {
          resolve(response);
        }
      });
    });
  }

}
