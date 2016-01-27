import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';

import './topBar.scss';

class TopBar extends Component {

  static propTypes = {
    login: React.PropTypes.shape({
      email: React.PropTypes.string
    })
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
          <button className="menu-icon show-for-small-only" type="button"/>
          <span className="title-bar-title">Sticky<span className="captialized">Bros</span></span>
        </div>
        <div className="title-bar-right">
          <span className="email show-for-medium">{this.props.login.email}</span>
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
