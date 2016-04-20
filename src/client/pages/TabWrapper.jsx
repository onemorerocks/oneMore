import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import Profile from './profile/Profile.jsx';
import TopBar from '../components/TopBar.jsx';
import Tabs from '../components/Tabs.jsx';
import SignedInHome from './SignedInHome.jsx';
import Home from './Home.jsx';
import EmailSent from './EmailSent.jsx';
import Guys from './Guys.jsx';
import GuyView from './GuyView.jsx';
import cssModules from '../lib/cssModules';
import styles from './tabWrapper.scss';

class TabWrapper extends Component {

  static propTypes = {
    login: React.PropTypes.object,
    location: React.PropTypes.object,
    routeParams: React.PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {

    if (!this.props.login.email) {
      return <Home {...this.props} styles={null} />;
    } else if (!this.props.login.emailVerified) {
      return <EmailSent {...this.props} styles={null} />;
    }

    let showHome = 'none';
    let showGuys = 'none';
    let showGuyView = 'none';
    let showProfile = 'none';
    let activeTab;

    if (!this.props.login.profile.birthYear) {
      showProfile = 'block';
    } else {
      if (this.props.location.pathname === '/') {
        showHome = 'block';
        activeTab = 'home';
      } else if (this.props.location.pathname.startsWith('/guys')) {
        if (this.props.routeParams.profileId) {
          showGuyView = true;
        } else {
          showGuys = 'block';
        }
        activeTab = 'guys';
      } else if (this.props.location.pathname === '/profile') {
        showProfile = 'block';
        activeTab = 'profile';
      }
    }

    return (
      <div>
        <TopBar login={this.props.login} />
        {activeTab && <Tabs activeTab={activeTab} />}
        {!activeTab && <br />}
        <div styleName="main" style={{ display: showHome }}>
          <SignedInHome {...this.props} styles={null} />
        </div>
        <div styleName="main" style={{ display: showGuys }}>
          <Guys {...this.props} styles={null} />
        </div>
        <div styleName="main" style={{ display: showGuyView }}>
          <GuyView {...this.props} profileId={this.props.routeParams.profileId} styles={null} />
        </div>
        <div styleName="main" style={{ display: showProfile }}>
          <Profile {...this.props} styles={null} />
        </div>
        <footer>&nbsp;</footer>
      </div>
    );
  }

}

export default Relay.createContainer(cssModules(TabWrapper, styles), {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        email,
        emailVerified,
        profile {
          birthYear
        }
        ${TopBar.getFragment('login')},
        ${SignedInHome.getFragment('login')},
        ${Guys.getFragment('login')},
        ${GuyView.getFragment('login')},
        ${Profile.getFragment('login')},
        ${EmailSent.getFragment('login')}
      }
    `
  }
});
