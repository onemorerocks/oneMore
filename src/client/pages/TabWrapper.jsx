import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import HomeWrapper from './HomeWrapper.jsx';
import Profile from './Profile.jsx';
import TopBar from '../components/TopBar.jsx';
import Tabs from '../components/Tabs.jsx';

class TabWrapper extends Component {

  static propTypes = {
    login: React.PropTypes.object,
    location: React.PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {

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
        <TopBar login={this.props.login}/>
        <Tabs activeTab={activeTab}/>
        <div style={{ display: showHome }}>
          <HomeWrapper {...this.props}/>
        </div>
        <div style={{ display: showProfile }}>
          <Profile {...this.props}/>
        </div>
      </div>
    );
  }

}

export default Relay.createContainer(TabWrapper, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        ${TopBar.getFragment('login')},
        ${HomeWrapper.getFragment('login')},
        ${Profile.getFragment('login')},
      }
    `
  }
});
