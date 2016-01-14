import React, { Component, PropTypes } from 'react';
import config from '../config';

export default class SignupEmail extends Component {

  static propTypes = {
    email: PropTypes.string.isRequired,
    emailVerificationKey: PropTypes.string.isRequired
  };

  render() {

    const email = this.props.email;
    const key = this.props.emailVerificationKey;

    return (
      <html lang="en">
      <head>
      </head>
      <body>

      <h1>Welcome to StickyBros</h1>
      <p>Click <a href={`${config.domain}/email-verify?email=${email}&key=${key}`}>this link</a> to
        get started by making a profile.</p>
      </body>
      </html>
    );
  }

}
