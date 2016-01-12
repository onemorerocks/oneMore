import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';

import './topBar.scss';

class TopBar extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    login: React.PropTypes.shape({
      email: React.PropTypes.string
    })
  };

  _handleLogout = () => {
    window.location.href = '/api/logout';
  };

  render() {
    return (
      <div className="title-bar">
        <div className="title-bar-left">
          <button className="menu-icon show-for-small-only" type="button"/>
          <span className="title-bar-title">StickyBros</span>
        </div>
        <div className="title-bar-right">
          <span className="email">{this.props.login.email}</span>
          <button className="small button" onClick={this._handleLogout}>Logout</button>
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
