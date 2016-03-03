import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Relay from 'react-relay';

import FormErrors from '../../components/FormErrors.jsx';
import Stars from '../../components/Stars.jsx';
import { profileStarsModel, profileKinksModel, allIds } from '../../../common/profileModel';
import ProfileMutation from './ProfileMutation';
import RadioGroup from 'react-radio';

import './profile.scss';

const years = [];
for (let i = 1998; i >= 1919; i--) {
  years.push(i);
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const kgs = [];
for (let i = 22; i <= 226; i += 2) {
  kgs.push({ label: i + 'kg', value: i });
}

const lbs = [];
for (let i = 50; i <= 500; i += 5) {
  const rawKg = Math.round(i * 0.453592);
  const kg = rawKg % 2 === 0 ? rawKg : rawKg - 1;
  lbs.push({ label: i + ' lb', value: kg });
}

const feet = [];
for (let i = 48; i <= 96; i++) {
  const foot = Math.floor(i / 12);
  const inches = i - foot * 12;
  const cm = Math.round(i * 2.54);
  feet.push({ label: foot + '\'' + inches + '"', value: cm });
}

const cms = [];
feet.forEach((foot) => {
  cms.push({ label: foot.value + ' cm', value: foot.value });
});

const waistInches = [];
for (let i = 20; i <= 80; i += 2) {
  const cm = Math.round(i * 2.54);
  waistInches.push({ label: i + '', value: cm });
}

const waistCms = [];
waistInches.forEach((waistInch) => {
  waistCms.push({ label: waistInch.value + ' cm', value: waistInch.value });
});


const decorateLessMore = (array) => {
  array[0].label = array[0].label + ' or less';
  array[array.length - 1].label = array[array.length - 1].label + ' or more';
};

decorateLessMore(kgs);
decorateLessMore(lbs);
decorateLessMore(feet);
decorateLessMore(cms);

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

    const stateObj = {
      submitDisabled: false,
      errors: [],
      forceShow: new Set()
    };

    allIds.forEach((id) => {
      stateObj[id] = props.login.profile[id];
    });

    this.state = stateObj;
  }

  _handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.submitDisabled) {
      return;
    }

    this.setState({ submitDisabled: true, errors: [] });

    const obj = { login: this.props.login };

    allIds.forEach((id) => {
      obj[id] = this._getValue(id);
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

  _getValue(id) {
    const refs = this.refs;
    if (refs[id]) {
      if (refs[id].getValue) {
        return refs[id].getValue();
      } else {
        return refs[id].value;
      }
    } else if (this.state[id]) {
      return this.state[id];
    }
    return null;
  }

  _handleOnChange = (key) => {
    return (v) => {
      const obj = {};

      let value = v;
      if (value.target && value.target.value) {
        value = value.target.value;
      }

      obj[key] = value;
      this.setState(obj);
    };
  };

  _handleNickname = this._handleOnChange('nickname');
  _handleBirthYear = this._handleOnChange('birthYear');
  _handleBirthMonth = this._handleOnChange('birthMonth');
  _handleWeightUnits = this._handleOnChange('weightUnits');
  _handleWeight = this._handleOnChange('weight');
  _handleHeightUnits = this._handleOnChange('heightUnits');
  _handleHeight = this._handleOnChange('height');
  _handleWaistUnits = this._handleOnChange('waistUnits');
  _handleWaist = this._handleOnChange('waist');
  _handleForeskin = this._handleOnChange('foreskin');

  render() {
    const profile = this.props.login.profile;

    if (!profile) {
      return <noscript />;
    }

    const stars = (name) => <Stars id={name} defaultValue={profile[name]} ref={name} />;

    const starGroup = (groupModel, i) => {
      return (
        <FormGroup key={groupModel.group}>
          {groupModel.rows.map((rowModel) => {
            const value = this._getValue(rowModel.id);
            let feeling = 'love';
            if (value === 1) {
              feeling = "don't like";
            }
            return (
              <span key={rowModel.id}>
                {!value && <span>Do you like <strong>{rowModel.text}</strong>?</span>}
                {value && <span>I {feeling} <strong>{rowModel.text}</strong></span>}
                {stars(rowModel.id)}
              </span>
            );
          })}
        </FormGroup>
      );
    };

    const handleKinkSelect = (el) => {
      this.state.forceShow.add(el.target.value);
      this.forceUpdate();
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 1);
    };

    const state = this.state;

    return (
      <DocumentTitle title="oneMore - Profile">
        <form onSubmit={this._handleSubmit} className="profile">

          <div className="row">
            <div className="small-12 columns">
              <FormErrors errors={this.state.errors} />

              <h3>Profile</h3>

              <label>
                Nickanme
                <input type="text" value={state.nickname} maxLength="20" required onChange={this._handleNickname} />
              </label>
            </div>
            <div className="small-6 large-4 columns">
              <label>
                Birth Year
                <select required defaultValue="" value={state.birthYear} onChange={this._handleBirthYear}>
                  {!profile.birthYear && <option disabled hidden value="" />}
                  {years.map((year) => {
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </label>
            </div>
            <div className="small-6 large-4 columns">
              <label>
                Birth Month
                <select required defaultValue="" value={state.birthMonth} onChange={this._handleBirthMonth}>
                  {!profile.birthMonth && <option disabled hidden value="" />}
                  {months.map((month, i) => {
                    return <option key={month} value={i}>{month}</option>;
                  })}
                </select>
              </label>
            </div>
            <div className="small-12 medium-6 large-4 columns">
              <div>
                <label className="hor-label-container" htmlFor="weight">
                  Weight
                </label>
                <RadioGroup name="weightUnits" value={state.weightUnits} onChange={this._handleWeightUnits}
                            className="hor-label-container">
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="lb" required />lb
                  </label>
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="kg" />kg
                  </label>
                </RadioGroup>
                <select id="weight" defaultValue="" value={state.weight} onChange={this._handleWeight}
                        required>
                  {!state.weight && <option disabled hidden value="" />}
                  {state.weightUnits === 'kg' && kgs.map((kg) => {
                    return <option key={'kg' + kg.value} value={kg.value}>{kg.label}</option>;
                  })}
                  {state.weightUnits === 'lb' && lbs.map((lb) => {
                    return <option key={'lb' + lb.value} value={lb.value}>{lb.label}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="small-12 medium-6 large-4 columns">
              <div>
                <label className="hor-label-container" htmlFor="height">
                  Height
                </label>
                <RadioGroup name="heightUnits" value={state.heightUnits} onChange={this._handleHeightUnits}
                            className="hor-label-container">
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="feet" required />feet
                  </label>
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="cm" />cm
                  </label>
                </RadioGroup>
                <select id="height" defaultValue="" value={state.height} onChange={this._handleHeight}>
                  {!state.height && <option disabled hidden value="" />}
                  {state.heightUnits === 'feet' && feet.map((foot) => {
                    return <option key={'heightFeet' + foot.value} value={foot.value}>{foot.label}</option>;
                  })}
                  {state.heightUnits === 'cm' && cms.map((cm) => {
                    return <option key={'heightCm' + cm.value} value={cm.value}>{cm.label}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="small-12 medium-6 large-4 columns">
              <div>
                <label className="hor-label-container" htmlFor="waist">
                  Waist
                </label>
                <RadioGroup name="waistUnits" value={state.waistUnits} onChange={this._handleWaistUnits} className="hor-label-container">
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="inches" required />inches
                  </label>
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="cm" />cm
                  </label>
                </RadioGroup>
                <select id="waist" defaultValue="" value={state.waist} onChange={this._handleWaist}>
                  {!state.waist && <option disabled hidden value="" />}
                  {state.waistUnits === 'inches' && waistInches.map((inch) => {
                    return <option key={'waistInches' + inch.value} value={inch.value}>{inch.label}</option>;
                  })}
                  {state.waistUnits === 'cm' && waistCms.map((cm) => {
                    return <option key={'waistCms' + cm.value} value={cm.value}>{cm.label}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="small-6 large-4 columns">
              <label>
                Foreskin
                <select required defaultValue="" value={state.foreskin} onChange={this._handleForeskin}>
                  {!state.foreskin && <option disabled hidden value="" />}
                  <option value="cut">Cut</option>
                  <option value="uncut">Uncut</option>
                </select>
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
              <select onChange={handleKinkSelect}>
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
                     value="Save Profile" />
            </div>
          </div>
        </form>
      </DocumentTitle>
    );
  }

}

export default Relay.createContainer(Profile, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        ${ProfileMutation.getFragment('login')},
        profile {
          nickname,
          weightUnits,
          birthMonth,
          birthYear,
          weight,
          heightUnits,
          height,
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
