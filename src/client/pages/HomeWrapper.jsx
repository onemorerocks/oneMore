import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import SignedInHome from './SignedInHome.react';
import EmailSent from './emailSent.react';
import Home from './Home.react';

class HomeWrapper extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    login: React.PropTypes.shape({
      email: React.PropTypes.string,
      emailVerified: React.PropTypes.bool
    })
  };

  render() {
    if (!this.props.login.email) {
      return <Home {...this.props} />;
    } else {
      if (this.props.login.emailVerified) {
        return <SignedInHome {...this.props}/>;
      } else {
        return <EmailSent {...this.props}/>;
      }
    }
  }

}

export default Relay.createContainer(HomeWrapper, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        email,
        emailVerified,
        ${SignedInHome.getFragment('login')},
        ${EmailSent.getFragment('login')},
      }
    `
  }
});
