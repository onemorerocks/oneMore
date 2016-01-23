import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Relay from 'react-relay';

import AuthWrapper from '../components/AuthWrapper.jsx';
import TopBar from '../components/TopBar.jsx';
import Tabs from '../components/Tabs.jsx';
import FormErrors from '../components/FormErrors.jsx';
import Stars from '../components/Stars.jsx';

import './profile.scss';

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
    return {
      nickname: this.props.nickname,
      givesHead: this.props.givesHead
    };
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

const FormRow = (props) =>
  <span>
    {props.label}
    {props.children}
  </span>;

FormRow.propTypes = {
  label: React.PropTypes.any
};

const FormOneColRow = (props) =>
  <div className="row">
    <div className="medium-12 columns medium-text-center">
      <FormRow label={props.children[0]}>
        {props.children[1]}
      </FormRow>
    </div>
  </div>;

const FormTwoColRow = (props) =>
  <div className="row">
    <div className="medium-6 columns medium-text-right two-col-left">
      <FormRow label={props.children[0]}>
        {props.children[1]}
      </FormRow>
    </div>
    <div className="medium-6 columns two-col-right">
      <FormRow label={props.children[2]}>
        {props.children[3]}
      </FormRow>
    </div>
  </div>;


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

    const refs = this.refs;

    Relay.Store.commitUpdate(
      new ProfileMutation({
        login: this.props.login,
        nickname: refs.nicknameInput.value,
        givesHead: refs.givesHead.getValue()
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

    const stars = (name) => <Stars id={name} defaultValue={profile[name]} ref={name}/>;

    return (
      <DocumentTitle title="StickyBros - Profile">
        <AuthWrapper login={this.props.login}>
          <TopBar login={this.props.login}/>
          <Tabs activeTab="profile"/>
          <form onSubmit={this._handleSubmit}>

            <div className="row profile">
              <div className="small-12 columns">
                <FormErrors errors={this.state.errors}/>

                <label>
                  Nickanme
                  <input type="text" ref="nicknameInput" defaultValue={profile.nickname}/>
                </label>

                <FormTwoColRow>
                  <span>I like <strong>giving blowjobs</strong></span>
                  {stars('givesHead')}

                  <span>I like <strong>getting blown</strong></span>
                  {stars('getsHead')}
                </FormTwoColRow>

                <FormOneColRow>
                  <span>I like <strong>69ing</strong></span>
                  {stars('sixtynine')}
                </FormOneColRow>

                <FormTwoColRow>
                  <span>I like <strong>giving handjobs</strong></span>
                  {stars('givesHand')}

                  <span>I like <strong>getting jacked-off</strong></span>
                  {stars('getsHand')}
                </FormTwoColRow>

                <FormOneColRow>
                  <span>I like <strong>mutual masturbation</strong></span>
                  {stars('mutualmast')}
                </FormOneColRow>

                <FormTwoColRow>
                  <span>I like <strong>fucking guys</strong></span>
                  {stars('givesFuck')}

                  <span>I like <strong>getting fucked</strong></span>
                  {stars('getsFucked')}
                </FormTwoColRow>

                <div>
                  <input type="submit" className="button float-right" disabled={this.state.submitDisabled}
                         value="Save Profile"/>
                </div>
              </div>
            </div>
          </form>
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
          nickname,
          givesHead
        }
      }
    `
  }
});
