import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

import './topBar.scss';

export class TopBar extends Component {

  static propTypes = {
    login: React.PropTypes.shape({
      email: React.PropTypes.string
    }),
    showLogin: React.PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  _handleLogout = () => {
    window.location.href = '/api/logout';
  };

  render() {
    return (
      <div className="title-bar">
        <div className="title-bar-left">
          <Link to="/">
            <span className="title-bar-title">one<span className="captialized">More</span></span>
          </Link>
        </div>
        <div className="title-bar-right">
          {this.props.login && <span className="email show-for-medium">{this.props.login.email}</span>}
          {this.props.showLogin && <Link className="medium button" to="/login">Login</Link>}
          {!this.props.showLogin && <button className="small button" onClick={this._handleLogout}>Logout</button>}
        </div>
      </div>
    );
  }

}

export default Relay.createContainer(TopBar, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        email,
      }
    `
  }
});
