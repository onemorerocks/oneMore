import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';

class AuthWrapper extends Component {

  static propTypes = {
    login: React.PropTypes.shape({
      email: React.PropTypes.string,
      emailVerified: React.PropTypes.bool
    })
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.login.email || !this.props.login.emailVerified) {
      this.context.router.push('/');
    }
  }

  render() {
    return <div>{this.props.children}</div>;
  }

}

export default Relay.createContainer(AuthWrapper, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        email,
        emailVerified
      }
    `
  }
});
