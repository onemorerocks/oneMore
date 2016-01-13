import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

import TopBar from '../components/TopBar.react';
import Tabs from '../components/Tabs.react';

class Profile extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    login: React.PropTypes.object
  };

  render() {
    return (
      <DocumentTitle title="StickyBros - Profile">
        <div>
          <TopBar login={this.props.login}/>
          <Tabs activeTab="profile"/>
          <div className="row">
            <div className="small-12 columns">
              <h1>Profile</h1>
              <Link to="/profile/images">Images</Link>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}

export default Relay.createContainer(Profile, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        ${TopBar.getFragment('login')}
      }
    `
  }
});
