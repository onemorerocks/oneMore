import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

import AuthWrapper from '../components/AuthWrapper.jsx';
import TopBar from '../components/TopBar.jsx';
import Tabs from '../components/Tabs.jsx';

class Profile extends Component {

  static propTypes = {
    login: React.PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title="StickyBros - Profile">
        <AuthWrapper login={this.props.login}>
          <TopBar login={this.props.login}/>
          <Tabs activeTab="profile"/>
          <div className="row">
            <div className="small-12 columns">
              <h1>Profile</h1>
              <Link to="/profile/images">Images</Link>
            </div>
          </div>
        </AuthWrapper>
      </DocumentTitle>
    );
  }

}

export default Relay.createContainer(Profile, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        ${TopBar.getFragment('login')},
        ${AuthWrapper.getFragment('login')},
      }
    `
  }
});
