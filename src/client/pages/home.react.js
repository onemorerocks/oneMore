import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';

import './home.scss';

export default class Home extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title="StickyBros - Login">
        <div>hello</div>
      </DocumentTitle>
    );
  }

}
