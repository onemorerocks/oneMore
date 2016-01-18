import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Relay from 'react-relay';

import AuthWrapper from '../components/AuthWrapper.jsx';
import TopBar from '../components/TopBar.jsx';
import Tabs from '../components/Tabs.jsx';
import FormErrors from '../components/FormErrors.jsx';
import Stars from '../components/Stars.jsx';

class ProfileMutation extends Relay.Mutation {

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
    return { nickname: this.props.nickname };
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
      fieldIDs: { updatedProfile: this.props.login.profile.id }
    }];
  }
}

class Profile extends Component {

  static propTypes = {
    login: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      submitDisabled: false,
      errors: []
    };
  }

  _handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.submitDisabled) {
      return;
    }

    this.setState({ submitDisabled: true, errors: [] });

    Relay.Store.commitUpdate(
      new ProfileMutation({
        login: this.props.login,
        nickname: this.refs.nicknameInput.value
      }),
      {
        onSuccess: () => {
          this.setState({ submitDisabled: false });
          global.msg.success('Saved!');
        },
        onFailure: (err) => {
          this.setState({ submitDisabled: false, errors: ['There was a server error.  Please try again shortly.'] });
        }
      }
    );
  };

  render() {
    const profile = this.props.login.profile;
    return (
      <DocumentTitle title="StickyBros - Profile">
        <AuthWrapper login={this.props.login}>
          <TopBar login={this.props.login}/>
          <Tabs activeTab="profile"/>
          <div className="row">
            <div className="small-12 columns">
              <FormErrors errors={this.state.errors}/>
              <form onSubmit={this._handleSubmit}>

                <label>
                  Nickname
                  <input type="text" ref="nicknameInput" defaultValue={profile.nickname}/>
                </label>

                <Stars id="blah" />

                <div>
                  <input type="submit" className="button" disabled={this.state.submitDisabled} value="Save Profile"/>
                </div>
              </form>
            </div>
          </div>
        </AuthWrapper>
      </DocumentTitle>
    );
  }

}

export default Relay.createContainer(Profile, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        ${TopBar.getFragment('login')},
        ${AuthWrapper.getFragment('login')},
        ${ProfileMutation.getFragment('login')},
        profile {
          nickname
        }
      }
    `
  }
});
