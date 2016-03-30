import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import './tabs.scss';

export default class Tabs extends Component {

  static propTypes = {
    activeTab: PropTypes.string.isRequired
  };

  static _tabs = [{
    id: 'home',
    url: '/',
    label: 'Home'
  }, {
    id: 'guys',
    url: '/guys',
    label: 'Guys'
  }, {
    id: 'events',
    url: '/events',
    label: 'Events'
  }, {
    id: 'profile',
    url: '/profile',
    label: 'Profile'
  }];

  constructor(props) {
    super(props);
  }

  render() {

    const renderTab = (tab) => {
      let liClass = 'tabs-title';
      let selected = false;
      if (this.props.activeTab === tab.id) {
        liClass += ' is-active';
        selected = true;
      }
      return (
        <li key={tab.id} className={liClass}>
          <Link to={tab.url} aria-selected={selected}>{tab.label}</Link>
        </li>
      );
    };

    return (
      <ul className="tabs show-for-medium">
        {Tabs._tabs.map((tab) => {
          return renderTab(tab);
        })}
      </ul>
    );
  }

}
