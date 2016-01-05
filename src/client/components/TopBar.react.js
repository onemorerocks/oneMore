import Component from 'react-pure-render/component';
import React from 'react';

import './topBar.scss';

export default class TopBar extends Component {

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
          <button className="menu-icon show-for-small-only" type="button" />
          <span className="title-bar-title">StickyBros</span>
        </div>
        <div className="title-bar-right">
          <span>test@test.com</span>
          <button className="small button" onClick={this._handleLogout}>Logout</button>
        </div>
      </div>
    );
  }

}
