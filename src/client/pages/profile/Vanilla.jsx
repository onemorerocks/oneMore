import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import { starIds, profileStarsModel } from '../../../common/profileModel';
import StarGroup from './StarGroup.jsx';

import './profile.scss';

class Vanilla extends Component {

  static propTypes = {
    login: React.PropTypes.object,
    onChange: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    const stateObj = {};

    starIds.forEach((id) => {
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
            <h3>Vanilla Sex</h3>
          </div>
          {profileStarsModel.map((groupModel, i) =>
            <StarGroup groupModel={groupModel} onChange={this._handleOnChange} data={this.state} key={'stargroup' + i} />)}
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Vanilla, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        profile {
          givesHead,
          getsHead,
          sixtynine,
          givesFuck,
          getsFucked,
          givesHand,
          getsHand,
          mutualMast,
          givesRim,
          getsRim,
          nipplePlay,
          kissing,
          cuddling
        }
      }
    `
  }
});
