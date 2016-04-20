import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cssModules from '../lib/cssModules';

import styles from './tabs.scss';

class Tabs extends Component {

  static propTypes = {
    activeTab: PropTypes.string.isRequired
  };

  static _tabs = [{
    id: 'home',
    url: '/',
    label: 'Home',
    hideOnSmall: true
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
  }, {
    id: 'chat',
    url: '/chat',
    label: 'Chat'
  }];

  constructor(props) {
    super(props);
  }

  Tab = (props) => {
    const tab = props.tab;
    let liClass = styles.title + ' tabs-title';
    let selected = false;
    if (this.props.activeTab === tab.id) {
      liClass += ' is-active';
      selected = true;
    }
    if (tab.hideOnSmall) {
      liClass += ' show-for-medium';
    }
    return (
      <li key={tab.id} className={liClass}>
        <Link to={tab.url} aria-selected={selected}>{tab.label}</Link>
      </li>
    );
  };

  render() {
    const Tab = this.Tab;
    return (
      <div>
        <ul className="tabs" styleName="tabs">
          {Tabs._tabs.map((tab, i) => <Tab tab={tab} key={'tab' + i} />)}
        </ul>
      </div>
    );
  }

}

export default cssModules(Tabs, styles);
