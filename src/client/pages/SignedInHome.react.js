import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';

import TopBar from '../components/TopBar.react';
import Tabs from '../components/Tabs.react';

import './home.scss';

export default class SignedInHome extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title="StickyBros - Home">
        <div>
          <TopBar />
          <Tabs activeTab="home"/>
          <div className="row">
            <div className="small-12 columns">
              <div>Signed in</div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}
