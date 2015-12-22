import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import config from '../config';

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
    return new Promise((resolve, reject) => {
      this.transporter.sendMail({
        from: config.emailFrom,
        to: to,
        subject: subject,
        generateTextFromHTML: true,
        html: html
      }, (error, response) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(response);
        }
      });
    });
  }


}

