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
  const kg = Math.round(i * 0.453592 * 100) / 100;
  lbs.push({ label: i + ' lb', value: kg });
}

const feet = [];
for (let i = 48; i <= 96; i++) {
  const foot = Math.floor(i / 12);
  const inches = i - foot * 12;
  const cm = Math.round(i * 2.54 * 100) / 100;
  feet.push({ label: foot + '\'' + inches + '"', value: cm });
}

const cms = [];
feet.forEach((foot) => {
  const roundedCm = Math.round(foot.value);
  cms.push({ label: roundedCm + ' cm', value: roundedCm });
});

const waistInches = [];
for (let i = 20; i <= 80; i += 2) {
  const cm = Math.round(i * 2.54 * 100) / 100;
  waistInches.push({ label: i + '"', value: cm });
}

const waistCms = [];
for (let i = 50; i <= 200; i += 5) {
  waistCms.push({ label: i + ' cm', value: i });
}

const cockLengthInches = [];
for (let i = 2; i <= 12; i += 0.5) {
  const cm = Math.round(i * 2.54 * 100) / 100;
  cockLengthInches.push({ label: i + '"', value: cm });
}

const cockLengthCms = [];
for (let i = 5; i <= 30; i += 1) {
  cockLengthCms.push({ label: i + ' cm', value: i });
}

const cockGirthInches = [];
for (let i = 2; i <= 8; i += 0.25) {
  const cm = Math.round(i * 2.54 * 100) / 100;
  cockGirthInches.push({ label: i + '"', value: cm });
}

const cockGirthCms = [];
for (let i = 5; i <= 20; i += 1) {
  cockGirthCms.push({ label: i + ' cm', value: i });
}

const decorateLessMore = (array) => {
  array[0].label = array[0].label + ' or less';
  array[array.length - 1].label = array[array.length - 1].label + ' or more';
};

decorateLessMore(kgs);
decorateLessMore(lbs);
decorateLessMore(feet);
decorateLessMore(cms);
decorateLessMore(waistInches);
decorateLessMore(waistCms);

const FormGroup = (props) =>
  <div className="small-12 medium-6 large-4 columns end">
    <fieldset className={'fieldset ' + props.className}>
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

  _closest(num, arr) {
    let lo = 0;
    let hi = arr.length - 1;
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < num) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    if (num - arr[lo] <= arr[hi] - num) {
      return arr[lo];
    }
    return arr[hi];
  }

  _handleOnUnitChange = (key, mapping) => {
    const changeFunc = this._handleOnChange(key);
    return (newUnit) => {
      mapping.targets.forEach((target, i) => {

        const values = mapping[newUnit][i].map((entry) => {
          return entry.value;
        });

        const previousValue = this.state[target];
        if (previousValue) {
          const newValue = this._closest(previousValue, values);
          const stateObj = {};
          stateObj[target] = newValue;
          this.setState(stateObj);
        }
      });
      changeFunc(newUnit);
    };
  };

  _handleNickname = this._handleOnChange('nickname');
  _handleBirthYear = this._handleOnChange('birthYear');
  _handleBirthMonth = this._handleOnChange('birthMonth');
  _handleWeightUnits = this._handleOnUnitChange('weightUnits', {
    lb: [lbs], kg: [kgs], targets: ['weight']
  });
  _handleWeight = this._handleOnChange('weight');
  _handleHeightUnits = this._handleOnUnitChange('heightUnits', {
    feet: [feet], cm: [cms], targets: ['height']
  });
  _handleHeight = this._handleOnChange('height');
  _handleWaistUnits = this._handleOnUnitChange('waistUnits', {
    inches: [waistInches], cm: [waistCms], targets: ['waist']
  });
  _handleWaist = this._handleOnChange('waist');
  _handleForeskin = this._handleOnChange('foreskin');
  _handleCockUnits = this._handleOnUnitChange('cockUnits', {
    inches: [cockLengthInches, cockGirthInches], cm: [cockLengthCms, cockGirthCms], targets: ['cockLength', 'cockGirth']
  });
  _handleCockLength = this._handleOnChange('cockLength');
  _handleCockGirth = this._handleOnChange('cockGirth');
  _handleHiv = this._handleOnChange('hiv');
  _handleSafer = this._handleOnChange('safer');
  _handleEthnicity = this._handleOnChange('ethnicity');
  _handleMixEthnicity = this._handleOnChange('mixEthnicity');
  _handleMasc = this._handleOnChange('masc');
  _handleFem = this._handleOnChange('fem');

  doSetState = (state) => this.setState(state);

  stars = (name) => <Stars id={name} value={this.state[name]} setState={this.doSetState} />;

  starGroup = (groupModel, i) => {
    return (
      <FormGroup key={groupModel.group}>
        {groupModel.rows.map((rowModel) => {
          const value = this.state[rowModel.id];
          let feeling = '?';
          if (value === '1') {
            feeling = "don't like";
          } else if (value === '2') {
            feeling = "rarely like";
          } else if (value === '3') {
            feeling = "sometimes like";
          } else if (value === '4') {
            feeling = "enjoy";
          } else if (value === '5') {
            feeling = "love";
          }
          return (
            <span key={rowModel.id}>
                {!value && <span>Do you like <strong>{rowModel.text}</strong>?</span>}
              {value && <span>I {feeling} <strong>{rowModel.text}</strong></span>}
              {this.stars(rowModel.id)}
              </span>
          );
        })}
      </FormGroup>
    );
  };

  render() {
    const profile = this.props.login.profile;

    if (!profile) {
      return <noscript />;
    }

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

          <div className="row mainProfile">
            <div className="small-12 columns">
              <FormErrors errors={this.state.errors} />

              <h3>Profile</h3>
            </div>
            <FormGroup>
              <div>
                <label>
                  Nickanme
                  <input type="text" value={state.nickname} maxLength="20" required onChange={this._handleNickname} />
                </label>
              </div>
              <div>
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
              <div>
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
            </FormGroup>
            <FormGroup>
              <div>
                <label className="hor-label-container" htmlFor="weight">
                  Weight
                </label>
                <RadioGroup name="weightUnits" value={state.weightUnits} onChange={this._handleWeightUnits}
                            className="hor-radio-container">
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
              <div>
                <label className="hor-label-container" htmlFor="height">
                  Height
                </label>
                <RadioGroup name="heightUnits" value={state.heightUnits} onChange={this._handleHeightUnits}
                            className="hor-radio-container">
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
              <div>
                <label className="hor-label-container" htmlFor="waist">
                  Waist
                </label>
                <RadioGroup name="waistUnits" value={state.waistUnits} onChange={this._handleWaistUnits} className="hor-radio-container">
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
            </FormGroup>
            <FormGroup>
              <div>
                <label className="hor-label-container" htmlFor="cockLength">
                  Cock Length
                </label>
                <RadioGroup name="cockUnits" value={state.cockUnits} onChange={this._handleCockUnits} className="hor-radio-container">
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="inches" required />inches
                  </label>
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="cm" />cm
                  </label>
                </RadioGroup>
                <select id="cockLength" defaultValue="" value={state.cockLength} onChange={this._handleCockLength}>
                  {!state.cockLength && <option disabled hidden value="" />}
                  <option value="0">Don't have one</option>
                  {state.cockUnits === 'inches' && cockLengthInches.map((inch) => {
                    return <option key={'cockLengthInches' + inch.value} value={inch.value}>{inch.label}</option>;
                  })}
                  {state.cockUnits === 'cm' && cockLengthCms.map((cm) => {
                    return <option key={'cockLengthCms' + cm.value} value={cm.value}>{cm.label}</option>;
                  })}
                </select>
              </div>
              <div>
                <label className="hor-label-container" htmlFor="cockGirth">
                  Cock Girth
                </label>
                <a href="http://www.bestenhancements.com/wp-content/uploads/2013/09/How-to-measure-your-penis.png" className="float-right"
                   target="_blank">How to measure</a>
                <select id="cockGirth" defaultValue="" value={state.cockGirth} onChange={this._handleCockGirth}>
                  {!state.cockGirth && <option disabled hidden value="" />}
                  <option value="0">Don't have one</option>
                  {state.cockUnits === 'inches' && cockGirthInches.map((inch) => {
                    return <option key={'cockGirthInches' + inch.value} value={inch.value}>{inch.label}</option>;
                  })}
                  {state.cockUnits === 'cm' && cockGirthCms.map((cm) => {
                    return <option key={'cockGirthCms' + cm.value} value={cm.value}>{cm.label}</option>;
                  })}
                </select>
              </div>
              <div>
                <label>
                  Foreskin
                  <select required defaultValue="" value={state.foreskin} onChange={this._handleForeskin}>
                    {!state.foreskin && <option disabled hidden value="" />}
                    <option value="cut">Cut</option>
                    <option value="semicut">Semi-Cut</option>
                    <option value="uncut">Uncut</option>
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className="thirdLast">
              <div>
                <label>
                  HIV Status
                  <select required defaultValue="" value={state.hiv} onChange={this._handleHiv}>
                    {!state.hiv && <option disabled hidden value="" />}
                    <option value="unknown">Don't Know</option>
                    <option value="no">Negative</option>
                    <option value="yes">Positive</option>
                    <option value="undetectable">Undetectable</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Safer Sex
                  <select required defaultValue="" value={state.safer} onChange={this._handleSafer}>
                    {!state.safer && <option disabled hidden value="" />}
                    <option value="no">Prefer Bareback</option>
                    <option value="yes">Prefer Condoms</option>
                    <option value="noprep">Prefer Bareback - on PrEP</option>
                    <option value="yesprep">Prefer Condoms - on PrEP</option>
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className="secondLast">
              <div>
                <label>
                  Ethnicity
                  <select required defaultValue="" value={state.ethnicity} onChange={this._handleEthnicity}>
                    {!state.ethnicity && <option disabled hidden value="" />}
                    <option value="asian">Asian</option>
                    <option value="black">Black</option>
                    <option value="latino">Latino</option>
                    <option value="middleeastern">Middle Eastern</option>
                    <option value="nativeamerican">Native American</option>
                    <option value="pacificislander">Pacific Islander</option>
                    <option value="southasian">South Asian</option>
                    <option value="white">White</option>
                    <option value="other">Other Ethnicity</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Mixed Ethnicity
                  <select required defaultValue="" value={state.mixEthnicity} onChange={this._handleMixEthnicity}>
                    <option value="">Not Mixed</option>
                    <option value="asian">Asian</option>
                    <option value="black">Black</option>
                    <option value="latino">Latino</option>
                    <option value="middleeastern">Middle Eastern</option>
                    <option value="nativeamerican">Native American</option>
                    <option value="pacificislander">Pacific Islander</option>
                    <option value="southasian">South Asian</option>
                    <option value="white">White</option>
                    <option value="other">Other Ethnicity</option>
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className="last">
              <div>
                <label>
                  Masculinity
                  <select required defaultValue="" value={state.masc} onChange={this._handleMasc}>
                    {!state.masc && <option disabled hidden value="" />}
                    <option value="0">Not Masculine</option>
                    <option value="1">Somewhat Masculine</option>
                    <option value="2">Masculine</option>
                    <option value="3">Very Masculine</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Femininity
                  <select required defaultValue="" value={state.fem} onChange={this._handleFem}>
                    {!state.fem && <option disabled hidden value="" />}
                    <option value="0">Not Feminine</option>
                    <option value="1">Somewhat Feminine</option>
                    <option value="2">Feminine</option>
                    <option value="3">Very Feminine</option>
                  </select>
                </label>
              </div>
            </FormGroup>
          </div>
          <div className="row">
            <div className="small-12 columns">
              <h3>Vanilla Sex</h3>
            </div>

            {profileStarsModel.map((groupModel) => {
              return this.starGroup(groupModel);
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
                  return null;
                })}
              </select>
            </div>
          </div>

          <div className="row">

            {profileKinksModel.map((groupModel) => {
              const forceShow = this.state.forceShow.has(groupModel.group);
              if (forceShow || groupModel.rows.find((rowModel) => profile[rowModel.id])) {
                return this.starGroup(groupModel);
              }
              return null;
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
          waistUnits,
          waist,
          cockUnits,
          cockLength,
          cockGirth,
          foreskin,
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
