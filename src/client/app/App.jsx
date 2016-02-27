import './foundation.scss';
import Component from 'react-pure-render/component';
import React from 'react';
import Toasts from '../components/Toasts.jsx';
import Relay from 'react-relay';

class App extends Component {

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


export default Relay.createContainer(App, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        email
      }
    `
  }
});
