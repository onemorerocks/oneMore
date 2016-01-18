import './foundation.scss';
import Component from 'react-pure-render/component';
import React from 'react';
import Toasts from '../components/Toasts.jsx';

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page">
        {this.props.children}
        <Toasts />
      </div>
    );
  }

}
