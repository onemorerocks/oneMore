import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import { profileKinksModel, kinkIds } from '../../../common/profileModel';
import StarGroup from './StarGroup.jsx';

import './profile.scss';

class Kinks extends Component {

  static propTypes = {
    login: React.PropTypes.object,
    onChange: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    const stateObj = {};

    kinkIds.forEach((id) => {
      stateObj[id] = props.login.profile[id];
    });

    this.state = stateObj;
  }

  _handleOnChange = (state) => {
    this.setState(state);
    this.props.onChange(state);
  };

  render() {
    const profile = this.props.login.profile;

    if (!profile) {
      return <noscript />;
    }

    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h3>Kinks</h3>
          </div>
        </div>
        <div className="row">
          {profileKinksModel.map((groupModel, i) =>
            <StarGroup groupModel={groupModel} onChange={this._handleOnChange} data={this.state} key={'stargroup' + i} />)}
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Kinks, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        profile {
          dom,
          sub
        }
      }
    `
  }
});
