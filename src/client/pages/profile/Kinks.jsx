import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import { profileKinksModel, kinkIds, profileKinksCheckboxModel } from '../../../common/profileModel';
import StarGroup from './StarGroup.jsx';
import ReactSelect from 'react-select';
import 'react-select/scss/default.scss';

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

  _handleOnKinkChange = (state) => {
    const valuesArray = state.map(({ value }) => value);
    this._handleOnChange({ kinks: valuesArray });
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
            <StarGroup groupModel={groupModel} onChange={this._handleOnChange} data={this.state} key={'stargroup' + i} />)
          }
          <div className="small-12 medium-6 large-4 columns end">
            <ReactSelect multi options={profileKinksCheckboxModel} clearable={false} value={this.state.kinks}
                         onChange={this._handleOnKinkChange} />
          </div>
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
          sub,
          kinks
        }
      }
    `
  }
});
