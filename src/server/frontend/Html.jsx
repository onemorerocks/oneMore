import React, { Component, PropTypes } from 'react';

export default class Html extends Component {

  static propTypes = {
    appCssHash: PropTypes.string.isRequired,
    bodyHtml: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isProduction: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { appCssHash, bodyHtml, isProduction, title } = this.props;

    // Only for production. For dev, it's handled by webpack with livereload.
    const linkStyles = isProduction &&
      <link
        href={'/_assets/' + appCssHash}
        rel="stylesheet"
      />;

    return (
      <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
        <title>{title}</title>
        {linkStyles}
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
      </head>
      <body dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </html>
    );
  }

}
