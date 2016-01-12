import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Relay from 'react-relay';

import TopBar from '../components/TopBar.react';
import Tabs from '../components/Tabs.react';

import './home.scss';

class SignedInHome extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    login: React.PropTypes.object
  };

  render() {
    return (
      <DocumentTitle title="StickyBros - Home">
        <div>
          <TopBar login={this.props.login}/>
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

export default Relay.createContainer(SignedInHome, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        ${TopBar.getFragment('login')}
      }
    `
  }
});
