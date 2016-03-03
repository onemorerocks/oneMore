import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import Profile from './profile/Profile.jsx';
import TopBar from '../components/TopBar.jsx';
import Tabs from '../components/Tabs.jsx';
import SignedInHome from './SignedInHome.jsx';
import Home from './Home.jsx';
import EmailSent from './EmailSent.jsx';

class TabWrapper extends Component {

  static propTypes = {
    login: React.PropTypes.object,
    location: React.PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {

    if (!this.props.login.email) {
      return <Home {...this.props} />;
    } else if (!this.props.login.emailVerified) {
      return <EmailSent {...this.props} />;
    }

    let showHome = 'none';
    let showProfile = 'none';
    let activeTab;

    if (this.props.location.pathname === '/') {
      showHome = 'block';
      activeTab = 'home';
    } else if (this.props.location.pathname === '/profile') {
      showProfile = 'block';
      activeTab = 'profile';
    }

    return (
      <div>
        <TopBar login={this.props.login} />
        <Tabs activeTab={activeTab} />
        <div style={{ display: showHome }}>
          <SignedInHome {...this.props} />
        </div>
        <div style={{ display: showProfile }}>
          <Profile {...this.props} />
        </div>
      </div>
    );
  }

}

export default Relay.createContainer(TabWrapper, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        email,
        emailVerified,
        ${TopBar.getFragment('login')},
        ${SignedInHome.getFragment('login')},
        ${Profile.getFragment('login')},
        ${EmailSent.getFragment('login')}
      }
    `
  }
});
