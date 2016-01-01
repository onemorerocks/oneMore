import Component from 'react-pure-render/component';
import React from 'react';

import './topBar.scss';

export default class TopBar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="title-bar">
        <div className="title-bar-left">
          <button className="menu-icon show-for-small-only" type="button"></button>
          <span className="title-bar-title">StickyBros</span>
        </div>
        <div className="title-bar-right">
          <button className="small button">Logout</button>
        </div>
      </div>
    );
  }

}
