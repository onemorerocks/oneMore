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

const profileStarModel = [
  'givesHead',
  'getsHead',
  'sixtynine',
  'givesFuck',
  'getsFucked',
  'givesHand',
  'getsHand',
  'mutualMast',
  'givesRim',
  'getsRim',
  'givesNipple',
  'getsNipple',
  'kissing',
  'cuddling',
  'givesFist',
  'getsFist',
  'givesTie',
  'getsTie',
  'givesPain',
  'getsPain'
];

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
    const obj = {
      nickname: this.props.nickname
    };
    profileStarModel.forEach((fieldName) => obj[fieldName] = this.props[fieldName]);
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
      fieldIDs: { updatedProfile: this.props.login.profile.id }
    }];
  }
}

const FormRow = (props) =>
  <span>
    {props.children[0]}
    {props.children[1]}
  </span>;

FormRow.propTypes = {
  label: React.PropTypes.any
};

const FormGroup = (props) =>
  <div className="small-12 medium-6 large-4 columns end">
    <fieldset className="fieldset">
      {props.children}
    </fieldset>
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

    const obj = {
      login: this.props.login,
      nickname: refs.nicknameInput.value
    };

    profileStarModel.forEach((fieldName) => obj[fieldName] = refs[fieldName].getValue());

    Relay.Store.commitUpdate(
      new ProfileMutation(obj),
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
          <form onSubmit={this._handleSubmit} className="profile">

            <div className="row">
              <div className="small-12 columns">
                <FormErrors errors={this.state.errors}/>

                <label>
                  Nickanme
                  <input type="text" ref="nicknameInput" defaultValue={profile.nickname}/>
                </label>

                <h3>Vanilla Sex</h3>
              </div>

              <FormGroup>
                <FormRow>
                  <span>I like <strong>giving blowjobs</strong></span>
                  {stars('givesHead')}
                </FormRow>
                <FormRow>
                  <span>I like <strong>getting blown</strong></span>
                  {stars('getsHead')}
                </FormRow>
                <FormRow>
                  <span>I like <strong>69ing</strong></span>
                  {stars('sixtynine')}
                </FormRow>
              </FormGroup>

              <FormGroup>
                <FormRow>
                  <span>I like <strong>fucking guys</strong></span>
                  {stars('givesFuck')}
                </FormRow>
                <FormRow>
                  <span>I like <strong>getting fucked</strong></span>
                  {stars('getsFucked')}
                </FormRow>
              </FormGroup>

              <FormGroup>
                <FormRow>
                  <span>I like <strong>giving handjobs</strong></span>
                  {stars('givesHand')}
                </FormRow>
                <FormRow>
                  <span>I like <strong>getting jacked-off</strong></span>
                  {stars('getsHand')}
                </FormRow>
                <FormRow>
                  <span>I like <strong>mutual masturbation</strong></span>
                  {stars('mutualMast')}
                </FormRow>
              </FormGroup>

              <FormGroup>
                <FormRow>
                  <span>I like <strong>rimming guys</strong></span>
                  {stars('givesRim')}
                </FormRow>
                <FormRow>
                  <span>I like <strong>getting rimmed</strong></span>
                  {stars('getsRim')}
                </FormRow>
              </FormGroup>

              <FormGroup>
                <FormRow>
                  <span>I like <strong>playing with guy's nipples</strong></span>
                  {stars('givesNipple')}
                </FormRow>
                <FormRow>
                  <span>I like <strong>getting my nipples played with</strong></span>
                  {stars('getsNipple')}
                </FormRow>
              </FormGroup>

              <FormGroup>
                <FormRow>
                  <span>I like <strong>kissing</strong></span>
                  {stars('kissing')}
                </FormRow>
                <FormRow>
                  <span>I like <strong>cuddling</strong></span>
                  {stars('cuddling')}
                </FormRow>
              </FormGroup>
            </div>
            <div className="row">
              <div className="small-12 columns">
                <h3>Kinks</h3>
              </div>

              <FormGroup>
                <FormRow>
                  <span>I like <strong>fisting guys</strong></span>
                  {stars('givesFist')}
                </FormRow>
                <FormRow>
                  <span>I like <strong>getting fisted</strong></span>
                  {stars('getsFist')}
                </FormRow>
              </FormGroup>

              <FormGroup>
                <FormRow>
                  <span>I like <strong>tying guys up</strong></span>
                  {stars('givesTie')}
                </FormRow>
                <FormRow>
                  <span>I like <strong>getting tied up</strong></span>
                  {stars('getsTie')}
                </FormRow>
              </FormGroup>

              <FormGroup>
                <FormRow>
                  <span>I like <strong>inflicting pain</strong></span>
                  {stars('givesPain')}
                </FormRow>
                <FormRow>
                  <span>I like <strong>receiving pain</strong></span>
                  {stars('getsPain')}
                </FormRow>
              </FormGroup>

              <div className="small-12 columns">
                <input type="submit" className="button float-right" disabled={this.state.submitDisabled}
                       value="Save Profile"/>
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
          givesNipple,
          getsNipple,
          kissing,
          cuddling,
          givesFist,
          getsFist,
          givesTie,
          getsTie,
          givesPain,
          getsPain
        }
      }
    `
  }
});
