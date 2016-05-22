import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import { Row, Column } from 'react-foundation';
import { starIds, profileStarsModel } from '../../../common/profileModel';
import StarGroup from './StarGroup.jsx';

class Vanilla extends Component {

  static propTypes = {
    login: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = this._buildInitStateObj();
  }

  _buildInitStateObj = () => {
    const stateObj = {};

    starIds.forEach((id) => {
      stateObj[id] = this.props.login.profile[id];
    });

    return stateObj;
  };

  reset = () => {
    this.setState(this._buildInitStateObj());
  };

  _handleOnChange = (state) => {
    this.setState(state);
  };

  render() {
    const profile = this.props.login.profile;

    if (!profile) {
      return <noscript />;
    }

    return (
      <div>
        <Row>
          <Column>
            <h3>Vanilla Sex</h3>
          </Column>
        </Row>
        <Row upOnLarge={3} upOnMedium={2} upOnSmall={1} verticalAlignment="stretch">
          {profileStarsModel.map((groupModel, i) =>
            <StarGroup groupModel={groupModel} onChange={this._handleOnChange} data={this.state} key={'stargroup' + i} />)}
        </Row>
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
          poppers,
          fourtwenty,
          nipplePlay,
          kissing,
          cuddling
        }
      }
    `
  }
});
