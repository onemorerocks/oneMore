import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Relay from 'react-relay';

import AuthWrapper from '../../components/AuthWrapper.jsx';
import FormErrors from '../../components/FormErrors.jsx';
import Stars from '../../components/Stars.jsx';
import { profileStarsModel, profileKinksModel, allIds } from '../../../common/profileModel';
import ProfileMutation from './ProfileMutation';
import RadioGroup from 'react-radio';

import './profile.scss';

const years = [];
for (let i = 1998; i >= 1918; i--) {
  years.push(i);
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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
      errors: [],
      forceShow: new Set()
    };
  }

  _handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.submitDisabled) {
      return;
    }

    this.setState({ submitDisabled: true, errors: [] });

    const refs = this.refs;

    const obj = { login: this.props.login };

    allIds.forEach((id) => {
      if (refs[id]) {
        if (refs[id].getValue) {
          obj[id] = refs[id].getValue();
        } else {
          obj[id] = refs[id].value;
        }
      }
    });

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

    if (!profile) {
      return <noscript />;
    }

    const stars = (name) => <Stars id={name} defaultValue={profile[name]} ref={name}/>;

    const starGroup = (groupModel, i) => {
      return (
        <FormGroup key={groupModel.group}>
          {groupModel.rows.map((rowModel) =>
            <FormRow key={rowModel.id}>
              <span>I like <strong>{rowModel.text}</strong></span>
              {stars(rowModel.id)}
            </FormRow>
          )}
        </FormGroup>
      );
    };

    const handleSelect = (el) => {
      this.state.forceShow.add(el.target.value);
      this.forceUpdate();
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 1);
    };

    return (
      <DocumentTitle title="StickyBros - Profile">
        <AuthWrapper login={this.props.login}>
          <form onSubmit={this._handleSubmit} className="profile">

            <div className="row">
              <div className="small-12 columns">
                <FormErrors errors={this.state.errors}/>

                <h3>Profile</h3>

                <label>
                  Nickanme
                  <input type="text" ref="nickname" defaultValue={profile.nickname} maxLength="20" required/>
                </label>
              </div>
              <div className="small-6 large-4 columns">
                <label>
                  Birth Year
                  <select ref="birthYear" required defaultValue={profile.birthYear}>
                    <option value="" disabled hidden defaultSelected={!profile.birthYear}></option>
                    {years.map((year) => {
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </label>
              </div>
              <div className="small-6 large-4 columns">
                <label>
                  Birth Month
                  <select ref="birthMonth" required defaultValue={profile.birthMonth}>
                    <option value="" disabled hidden></option>
                    {months.map((month, i) => {
                      return <option key={month} value={i}>{month}</option>;
                    })}
                  </select>
                </label>
              </div>
              <div className="small-6 large-4 columns">
                <label>
                  Weight
                  <RadioGroup name="weightUnits" defaultValue={profile.weightUnits} ref="weightUnits" className="hor-label-container">
                    <label className="hor-label">
                      <input className="hor-input" type="radio" value="lb" required/>lb
                    </label>
                    <label className="hor-label">
                      <input className="hor-input" type="radio" value="kg"/>kg
                    </label>
                    <label className="hor-label">
                      <input className="hor-input" type="radio" value="stone"/>stone
                    </label>
                  </RadioGroup>
                  <input type="number" ref="weight" required defaultValue={profile.weight}/>
                </label>
              </div>
              <div className="small-12 columns">
                <h3>Vanilla Sex</h3>
              </div>

              {profileStarsModel.map((groupModel) => {
                return starGroup(groupModel);
              })}

            </div>

            <div className="row">
              <div className="small-12 medium-6 large-4 columns">
                <h3>Kinks</h3>
                <select onChange={handleSelect}>
                  <option>--Add Kink--</option>
                  {profileKinksModel.map((groupModel) => {
                    const forceShow = this.state.forceShow.has(groupModel.group);
                    if (!forceShow && !groupModel.rows.find((rowModel) => profile[rowModel.id])) {
                      return <option key={groupModel.group} value={groupModel.group}>{groupModel.group}</option>;
                    }
                  })}
                </select>
              </div>
            </div>

            <div className="row">

              {profileKinksModel.map((groupModel) => {
                const forceShow = this.state.forceShow.has(groupModel.group);
                if (forceShow || groupModel.rows.find((rowModel) => profile[rowModel.id])) {
                  return starGroup(groupModel);
                }
              })}

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
        ${AuthWrapper.getFragment('login')},
        ${ProfileMutation.getFragment('login')},
        profile {
          nickname,
          weightUnits,
          birthMonth,
          birthYear,
          weight,
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
          getsPain,
          givesWs,
          getsWs
        }
      }
    `
  }
});
