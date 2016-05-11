import Relay from 'react-relay';

import { allIds } from '../../../common/profileModel';

export default class ProfileMutation extends Relay.Mutation {

  static fragments = {
    login: () => Relay.QL`
      fragment on Login {
        profile {
          id
        }
      }
    `
  };

  getMutation() {
    return Relay.QL`
      mutation{ updateProfile }
    `;
  }

  getVariables() {
    const obj = {};

    allIds.forEach((id) => {
      obj[id] = this.props[id];
    });

    return obj;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on MutateProfilePayload {
        updatedProfile
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { updatedProfile: this.props.id }
    }];
  }
}
