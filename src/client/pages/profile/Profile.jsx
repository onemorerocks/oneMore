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
decorateLessMore(cockLengthInches);
decorateLessMore(cockLengthCms);
decorateLessMore(cockGirthInches);
decorateLessMore(cockGirthCms);


const FormGroup = (props) =>
  <div className="small-12 medium-6 large-4 columns end">
    <fieldset className={'fieldset ' + props.className}>
      {props.children}
    </fieldset>
  </div>;

FormGroup.propTypes = {
  className: React.PropTypes.string
};

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

  _handleOnChange = (event, isNum) => {
    const obj = {};

    const value = event.target.value;
    const name = event.target.name;

    obj[name] = isNum ? parseFloat(value) : value;
    this.setState(obj);
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

  _handleOnUnitChange = (mapping) => {
    return (newUnit, event) => {
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
      this._handleOnChange(event);
    };
  };

  _handleWeightUnits = this._handleOnUnitChange({
    lb: [lbs], kg: [kgs], targets: ['weight']
  });
  _handleHeightUnits = this._handleOnUnitChange({
    feet: [feet], cm: [cms], targets: ['height']
  });
  _handleWaistUnits = this._handleOnUnitChange({
    inches: [waistInches], cm: [waistCms], targets: ['waist']
  });
  _handleCockUnits = this._handleOnUnitChange({
    inches: [cockLengthInches, cockGirthInches], cm: [cockLengthCms, cockGirthCms], targets: ['cockLength', 'cockGirth']
  });

  _handleCockLength = (event) => {
    if (event.target.value === '0') {
      this.setState({ cockGirth: '', foreskin: '' });
    }
    return this._handleOnChange(event, true);
  };

  doSetState = (state) => this.setState(state);

  stars = (name) => <Stars id={name} value={this.state[name]} setState={this.doSetState} />;

  starGroup = (groupModel, i) => {
    return (
      <FormGroup key={groupModel.group}>
        {groupModel.rows.map((rowModel) => {
          const value = this.state[rowModel.id];
          let feeling = '?';
          if (value === 1) {
            feeling = "don't like";
          } else if (value === 2) {
            feeling = 'rarely like';
          } else if (value === 3) {
            feeling = 'sometimes like';
          } else if (value === 4) {
            feeling = 'enjoy';
          } else if (value === 5) {
            feeling = 'love';
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
                  <input type="text" value={state.nickname} maxLength="20" required onChange={this._handleOnChange} name="nickname" />
                </label>
              </div>
              <div>
                <label>
                  Birth Year
                  <select required defaultValue="" value={state.birthYear} onChange={this._handleOnChange} name="birthYear">
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
                  <select required defaultValue="" value={state.birthMonth} onChange={this._handleOnChange} name="birthMonth">
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
                <select id="weight" defaultValue="" value={state.weight} onChange={this._handleOnChange} name="weight"
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
                <select id="height" defaultValue="" value={state.height} onChange={this._handleOnChange} name="height">
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
                <a href="http://www.webmd.com/diet/waist-measurement" className="float-right"
                   target="_blank">Not pants size</a>
                <select id="waist" defaultValue="" value={state.waist} onChange={this._handleOnChange} name="waist">
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
                <select id="cockLength" defaultValue="" value={state.cockLength} onChange={this._handleCockLength} name="cockLength">
                  {!state.cockLength && <option disabled hidden value="" />}
                  <option value={0}>Don't have a cock</option>
                  {state.cockUnits === 'inches' && cockLengthInches.map((inch) => {
                    return <option key={'cockLengthInches' + inch.value} value={inch.value}>{inch.label}</option>;
                  })}
                  {state.cockUnits === 'cm' && cockLengthCms.map((cm) => {
                    return <option key={'cockLengthCms' + cm.value} value={cm.value}>{cm.label}</option>;
                  })}
                </select>
              </div>
              {state.cockLength !== 0 && <div>
                <label className="hor-label-container" htmlFor="cockGirth">
                  Cock Girth
                </label>
                <a href="http://www.bestenhancements.com/wp-content/uploads/2013/09/How-to-measure-your-penis.png" className="float-right"
                   target="_blank">How to measure</a>
                <select id="cockGirth" defaultValue="" value={state.cockGirth} onChange={this._handleOnChange} name="cockGirth">
                  {!state.cockGirth && <option disabled hidden value="" />}
                  {state.cockUnits === 'inches' && cockGirthInches.map((inch) => {
                    return <option key={'cockGirthInches' + inch.value} value={inch.value}>{inch.label}</option>;
                  })}
                  {state.cockUnits === 'cm' && cockGirthCms.map((cm) => {
                    return <option key={'cockGirthCms' + cm.value} value={cm.value}>{cm.label}</option>;
                  })}
                </select>
              </div>}
              {state.cockLength !== 0 && <div>
                <label>
                  Foreskin
                  <select required defaultValue="" value={state.foreskin} onChange={this._handleOnChange} name="foreskin">
                    {!state.foreskin && <option disabled hidden value="" />}
                    <option value="cut">Cut</option>
                    <option value="semicut">Semi-cut</option>
                    <option value="uncut">Uncut</option>
                  </select>
                </label>
              </div>}
            </FormGroup>
            <FormGroup className="shortOnLarge">
              <div>
                <label>
                  Ethnicity
                  <select required defaultValue="" value={state.ethnicity} onChange={this._handleOnChange} name="ethnicity">
                    {!state.ethnicity && <option disabled hidden value="" />}
                    <option value="black">Black / African Descent</option>
                    <option value="asian">East Asian</option>
                    <option value="latino">Latino</option>
                    <option value="middleeastern">Middle Eastern / North African</option>
                    <option value="nativeamerican">Native American / Indigenous</option>
                    <option value="pacificislander">Pacific Islander</option>
                    <option value="southasian">South Asian</option>
                    <option value="white">White / Caucasian</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Mixed Ethnicity
                  <select defaultValue="" value={state.mixEthnicity} onChange={this._handleOnChange} name="mixEthnicity">
                    <option value="">Not Mixed</option>
                    {state.ethnicity !== 'black' && <option value="black">Black / African Descent</option>}
                    {state.ethnicity !== 'asian' && <option value="asian">East Asian</option>}
                    {state.ethnicity !== 'latino' && <option value="latino">Latino</option>}
                    {state.ethnicity !== 'middleeastern' && <option value="middleeastern">Middle Eastern / North African</option>}
                    {state.ethnicity !== 'nativeamerican' && <option value="nativeamerican">Native American / Indigenous</option>}
                    {state.ethnicity !== 'pacificislander' && <option value="pacificislander">Pacific Islander</option>}
                    {state.ethnicity !== 'southasian' && <option value="southasian">South Asian</option>}
                    {state.ethnicity !== 'white' && <option value="white">White / Caucasian</option>}
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className="short">
              <div>
                <label>
                  Eye Color
                  <select required defaultValue="" value={state.eye} onChange={this._handleOnChange} name="eye">
                    {!state.eye && <option disabled hidden value="" />}
                    <option value="amber">Amber</option>
                    <option value="blue">Blue</option>
                    <option value="brown">Brown</option>
                    <option value="hray">Gray</option>
                    <option value="hreen">Green</option>
                    <option value="hazel">Hazel</option>
                    <option value="heterochromia">Heterochromia (2 distinct colors)</option>
                    <option value="green">Green</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Hair Color
                  <select required defaultValue="" value={state.hair} onChange={this._handleOnChange} name="hair">
                    {!state.hair && <option disabled hidden value="" />}
                    <option value="bald">Bald</option>
                    <option value="black">Black</option>
                    <option value="blond">Blond</option>
                    <option value="brown">Brown</option>
                    <option value="brown">Dyed (blue, green, red, etc)</option>
                    <option value="gray">Gray</option>
                    <option value="red">Red</option>
                    <option value="white">White</option>
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className="short">
              <div>
                <label>
                  Body Hair
                  <select required defaultValue="" value={state.bodyHair} onChange={this._handleOnChange} name="bodyHair">
                    {!state.bodyHair && <option disabled hidden value="" />}
                    <option value="smooth">Smooth</option>
                    <option value="trimmed">Trimmed</option>
                    <option value="some">Some hair</option>
                    <option value="hairy">Hairy</option>
                    <option value="very">Very hairy</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Facial Hair
                  <select required defaultValue="" value={state.facialHair} onChange={this._handleOnChange} name="facialHair">
                    {!state.facialHair && <option disabled hidden value="" />}
                    <option value="none">None</option>
                    <option value="beard">Beard</option>
                    <option value="goatee">Goatee (chin only)</option>
                    <option value="vandyke">Goatee with moustache</option>
                    <option value="moustache">Moustache</option>
                    <option value="stubble">Stubble</option>
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className="short">
              <div>
                <label>
                  HIV Status
                  <select required defaultValue="" value={state.hiv} onChange={this._handleOnChange} name="hiv">
                    {!state.hiv && <option disabled hidden value="" />}
                    <option value="unknown">Don't know</option>
                    <option value="no">Negative</option>
                    <option value="yes">Positive</option>
                    <option value="undetectable">Undetectable</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Safer Sex
                  <select required defaultValue="" value={state.safer} onChange={this._handleOnChange} name="safer">
                    {!state.safer && <option disabled hidden value="" />}
                    <option value="no">Prefer bareback</option>
                    <option value="yes">Prefer condoms</option>
                    <option value="noprep">Prefer bareback - on PrEP</option>
                    <option value="yesprep">Prefer condoms - on PrEP</option>
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className="short">
              <div>
                <label>
                  Mannerisms & Speech
                  <select required defaultValue="" value={state.masc} onChange={this._handleOnChange} name="masc">
                    {!state.masc && <option disabled hidden value="" />}
                    <option value="0">Very masculine</option>
                    <option value="1">Masculine</option>
                    <option value="2">In the middle</option>
                    <option value="3">Feminine</option>
                    <option value="4">Very feminine</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Voice
                  <select required defaultValue="" value={state.voice} onChange={this._handleOnChange} name="voice">
                    {!state.fem && <option disabled hidden value="" />}
                    <option value="0">Very deep</option>
                    <option value="1">Deep</option>
                    <option value="2">Average</option>
                    <option value="3">High</option>
                    <option value="4">Very high</option>
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className="short">
              <div>
                <label>
                  Tobacco
                  <select required defaultValue="" value={state.smokes} onChange={this._handleOnChange} name="smokes">
                    {!state.smokes && <option disabled hidden value="" />}
                    <option value="no">Don't smoke</option>
                    <option value="cigs">Cigarettes</option>
                    <option value="both">Cigarettes & Cigars</option>
                    <option value="cigars">Cigars</option>
                    <option value="socially">Socially</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Discretion
                  <select required defaultValue="" value={state.discretion} onChange={this._handleOnChange} name="discretion">
                    {!state.discretion && <option disabled hidden value="" />}
                    <option value="no">Don't need to be discrete</option>
                    <option value="somewhat">Need to be discrete</option>
                    <option value="yes">Need to be very discrete</option>
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
          hiv,
          safer,
          ethnicity,
          mixEthnicity,
          masc,
          voice,
          eye,
          hair,
          bodyHair,
          facialHair,
          smokes,
          discretion,
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
