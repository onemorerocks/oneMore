import React, {Component, PropTypes} from 'react';

export default class SignupEmail extends Component {

  static propTypes = {
    hashedKey: PropTypes.string.isRequired
  };

  render() {

    const hashedKey = this.props.hashedKey;

    return (
      <html lang="en">
      <head>
      </head>
      <body>

      <h1>Welcome to StickyBros</h1>
      <p>Click <a href={`http://stickybros.org/email-verify?key=${hashedKey}`}>this link</a> to
        get started by making a profile.</p>
      </body>
      </html>
    );
  }

}
