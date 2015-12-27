import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';

import './home.scss';

export default class EmailSent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title="StickyBros - Email Sent">
        <div className="row">
          <div className="small-12 columns">
            <p>Alright, cool. We sent a verification email to your address.</p>
            <p>If you don't see it after a few minutes, check your spam folder.</p>
            <p>Still can't find it?  Just signup again and another email will go out.</p>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}
