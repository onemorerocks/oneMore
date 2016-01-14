import Component from 'react-pure-render/component';
import React from 'react';
import { Link } from 'react-router';

import './topBar.scss';

export default class LoginTopBar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="title-bar">
        <div className="title-bar-left">
          <span className="title-bar-title">StickyBros</span>
        </div>
        <div className="title-bar-right">
          <Link className="medium button" to="/login">Login</Link>
        </div>
      </div>
    );
  }

}
