import React, {Component, PropTypes} from 'react';

import './tabs.scss';

export default class Tabs extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    activeTab: PropTypes.string.isRequired
  };

  static _tabs = [{
    id: 'home',
    url: '/',
    label: 'Home'
  }, {
    id: 'bros',
    url: '/bros',
    label: 'Bros'
  }, {
    id: 'events',
    url: '/events',
    label: 'Events'
  }, {
    id: 'profile',
    url: '/profile',
    label: 'Profile'
  }];

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
          <a href={tab.url} aria-selected={selected}>{tab.label}</a>
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
