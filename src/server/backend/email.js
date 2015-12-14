import nodemailer from 'nodemailer';
import xoauth2 from 'xoauth2';
import config from '../config';

export default class Email {

  constructor() {

    const generator = xoauth2.createXOAuth2Generator({
      user: config.gmailUser,
      clientId: config.gmailClientId,
      clientSecret: config.gmailClientSecret,
      refreshToken: config.gmailRefreshToken
    });

    this.transporter = nodemailer.createTransport(({
      service: 'gmail',
      auth: {
        xoauth2: generator
      }
    }));

  }

  sendEmail(to, subject, html) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail({
        from: config.gmailUser,
        to: to,
        subject: subject,
        generateTextFromHTML: true,
        html: html
      }, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }


}

