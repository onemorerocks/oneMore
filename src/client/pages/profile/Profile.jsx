import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Relay from 'react-relay';

import FormErrors from '../../components/FormErrors.jsx';
import { allIds, excludeSavingFields, enums } from '../../../common/profileModel';
import ProfileMutation from './ProfileMutation';
import RadioGroup from 'react-radio';
import Vanilla from './Vanilla.jsx';
import Kinks from './Kinks.jsx';
import FormGroup from './FormGroup.jsx';
import Photos from './Photos.jsx';
import styles from './profile.scss';
import cssModules from '../../lib/cssModules';

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

const enumOptions = (optEnum, hideFunc) => {
  return Object.keys(optEnum).map((enumKey, i) => {
    if (hideFunc) {
      if (hideFunc(enumKey)) {
        return null;
      }
    }
    return <option key={i} value={enumKey}>{optEnum[enumKey]}</option>;
  });
};

class Profile extends Component {

  static propTypes = {
    login: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = this._buildInitStateObj();
  }

  _buildInitStateObj = () => {
    const stateObj = {
      submitDisabled: false,
      errors: []
    };

    allIds.forEach((id) => {
      if (this.props.login.profile[id]) {
        stateObj[id] = this.props.login.profile[id];
      } else {
        stateObj[id] = '';
      }
    });

    return stateObj;
  };

  _handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.submitDisabled) {
      return;
    }

    this.setState({ submitDisabled: true, errors: [] });

    const obj = { login: this.props.login };

    allIds.forEach((id) => {
      obj[id] = this.state[id];
    });

    const vanillaState = this.refs.vanilla.refs.component.state;
    allIds.forEach((id) => {
      if (vanillaState[id]) {
        obj[id] = vanillaState[id];
      }
    });

    const kinksState = this.refs.kinks.refs.component.state;
    allIds.forEach((id) => {
      if (kinksState[id]) {
        obj[id] = kinksState[id];
      }
    });

    excludeSavingFields.forEach((field) => {
      delete obj[field];
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
          window.scrollTo(0, 0);
        }
      }
    );
  };

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

  _handleReset = () => {
    this.setState(this._buildInitStateObj());
    this.refs.vanilla.refs.component.reset();
    this.refs.kinks.refs.component.reset();
    window.scrollTo(0, 0);
  };

  render() {
    const profile = this.props.login.profile;

    if (!profile) {
      return <noscript />;
    }

    const state = this.state;

    return (
      <DocumentTitle title="oneMore - Profile">
        <form onSubmit={this._handleSubmit}>

          <div className="row" styleName="mainProfile">
            <div className="small-12 columns">
              <FormErrors errors={this.state.errors} />

              <h3>Profile</h3>
            </div>
            <FormGroup>
              <div>
                <label>
                  Nickname
                  <input type="text" value={state.nickname} maxLength="20" required onChange={this._handleOnChange} name="nickname"
                         placeholder="e.g. Handsome Joe" />
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
                <label styleName="hor-label-container" htmlFor="weight">
                  Weight
                </label>
                <RadioGroup name="weightUnits" value={state.weightUnits} onChange={this._handleWeightUnits}
                            styleName="hor-radio-container">
                  <label styleName="hor-label">
                    <input styleName="hor-input" type="radio" value="lb" required />lb
                  </label>
                  <label styleName="hor-label">
                    <input styleName="hor-input" type="radio" value="kg" />kg
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
                <label styleName="hor-label-container" htmlFor="height">
                  Height
                </label>
                <RadioGroup name="heightUnits" value={state.heightUnits} onChange={this._handleHeightUnits}
                            styleName="hor-radio-container">
                  <label styleName="hor-label">
                    <input styleName="hor-input" type="radio" value="feet" required />feet
                  </label>
                  <label styleName="hor-label">
                    <input styleName="hor-input" type="radio" value="cm" />cm
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
                <label styleName="hor-label-container" htmlFor="waist">
                  Waist
                </label>
                <RadioGroup name="waistUnits" value={state.waistUnits} onChange={this._handleWaistUnits} styleName="hor-radio-container">
                  <label styleName="hor-label">
                    <input styleName="hor-input" type="radio" value="inches" required />inches
                  </label>
                  <label styleName="hor-label">
                    <input styleName="hor-input" type="radio" value="cm" />cm
                  </label>
                </RadioGroup>
                <a href="http://www.webmd.com/diet/waist-measurement" className="float-right" styleName="underlined-link"
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
                <label styleName="hor-label-container" htmlFor="cockLength">
                  Cock Length
                </label>
                <RadioGroup name="cockUnits" value={state.cockUnits} onChange={this._handleCockUnits} styleName="hor-radio-container">
                  <label styleName="hor-label">
                    <input styleName="hor-input" type="radio" value="inches" required />inches
                  </label>
                  <label styleName="hor-label">
                    <input styleName="hor-input" type="radio" value="cm" />cm
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
                <label className={styles['hor-label-container']} htmlFor="cockGirth">
                  Cock Girth
                </label>
                <a href="http://www.bestenhancements.com/wp-content/uploads/2013/09/How-to-measure-your-penis.png"
                   className="float-right" styleName="underlined-link" target="_blank">How to measure</a>
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
                  <select required value={state.foreskin} onChange={this._handleOnChange} name="foreskin">
                    {!state.foreskin && <option disabled hidden value="" />}
                    {enumOptions(enums.foreskin)}
                  </select>
                </label>
              </div>}
            </FormGroup>
            <FormGroup className={styles.shortOnLarge}>
              <div>
                <label>
                  Ethnicity
                  <select required defaultValue="" value={state.ethnicity} onChange={this._handleOnChange} name="ethnicity">
                    {!state.ethnicity && <option disabled hidden value="" />}
                    {enumOptions(enums.ethnicity)}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Mixed Ethnicity
                  <select defaultValue="" value={state.mixEthnicity} onChange={this._handleOnChange} name="mixEthnicity">
                    <option value="">Not Mixed</option>
                    {enumOptions(enums.ethnicity, (enumKey) => enumKey === state.ethnicity)}
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className={styles.short}>
              <div>
                <label>
                  Eye Color
                  <select required defaultValue="" value={state.eye} onChange={this._handleOnChange} name="eye">
                    {!state.eye && <option disabled hidden value="" />}
                    {enumOptions(enums.eye)}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Hair Color
                  <select required defaultValue="" value={state.hair} onChange={this._handleOnChange} name="hair">
                    {!state.hair && <option disabled hidden value="" />}
                    {enumOptions(enums.hair)}
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className={styles.short}>
              <div>
                <label>
                  Body Hair
                  <select required defaultValue="" value={state.bodyHair} onChange={this._handleOnChange} name="bodyHair">
                    {!state.bodyHair && <option disabled hidden value="" />}
                    {enumOptions(enums.bodyHair)}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Facial Hair
                  <select required defaultValue="" value={state.facialHair} onChange={this._handleOnChange} name="facialHair">
                    {!state.facialHair && <option disabled hidden value="" />}
                    {enumOptions(enums.facialHair)}
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className={styles.short}>
              <div>
                <label>
                  HIV Status
                  <select required defaultValue="" value={state.hiv} onChange={this._handleOnChange} name="hiv">
                    {!state.hiv && <option disabled hidden value="" />}
                    {enumOptions(enums.hiv)}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Safer Sex
                  <select required defaultValue="" value={state.safer} onChange={this._handleOnChange} name="safer">
                    {!state.safer && <option disabled hidden value="" />}
                    {enumOptions(enums.safer)}
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className={styles.short}>
              <div>
                <label>
                  Mannerisms & Speech
                  <select required defaultValue="" value={state.masc} onChange={this._handleOnChange} name="masc">
                    {!state.masc && <option disabled hidden value="" />}
                    {enumOptions(enums.masc)}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Voice
                  <select required defaultValue="" value={state.voice} onChange={this._handleOnChange} name="voice">
                    {!state.voice && <option disabled hidden value="" />}
                    {enumOptions(enums.voice)}
                  </select>
                </label>
              </div>
            </FormGroup>
            <FormGroup className={styles.short}>
              <div>
                <label>
                  Tobacco
                  <select required defaultValue="" value={state.smokes} onChange={this._handleOnChange} name="smokes">
                    {!state.smokes && <option disabled hidden value="" />}
                    {enumOptions(enums.smokes)}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Discretion
                  <select required defaultValue="" value={state.discretion} onChange={this._handleOnChange} name="discretion">
                    {!state.discretion && <option disabled hidden value="" />}
                    {enumOptions(enums.discretion)}
                  </select>
                </label>
              </div>
            </FormGroup>
            <div className="small-12 medium-12 large-6 columns end">
              <fieldset styleName="fieldset short">
                <label>
                  Description (1000 character max)
                  <textarea styleName="description" maxLength="1000" value={state.description} onChange={this._handleOnChange}
                            name="description" />
                </label>
              </fieldset>
            </div>
          </div>

          <Vanilla login={this.props.login} ref="vanilla" />
          <Kinks login={this.props.login} ref="kinks" />
          <Photos login={this.props.login} />

          <div className="row">
            <div className="small-12 columns" styleName="save-row">
              <div className="float-right">
                {profile.birthYear &&
                  <input type="button" className="button" styleName="cancel" disabled={this.state.submitDisabled} value="Reset"
                         onClick={this._handleReset} />
                }
                <input type="submit" className="button" disabled={this.state.submitDisabled} value="Save Profile" />
              </div>
            </div>
          </div>
        </form>
      </DocumentTitle>
    );
  }

}

export default Relay.createContainer(cssModules(Profile, styles), {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        ${ProfileMutation.getFragment('login')},
        ${Vanilla.getFragment('login')},
        ${Kinks.getFragment('login')},
        ${Photos.getFragment('login')},
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
          description
        }
      }
    `
  }
});
