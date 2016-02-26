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
  waistInches.push({ label: i + '', value: i });
}

const decorateLessMore = (array) => {
  array[0].label = array[0].label + ' or less';
  array[array.length - 1].label = array[array.length - 1].label + ' or more';
};

decorateLessMore(kgs);
decorateLessMore(lbs);
decorateLessMore(feet);
decorateLessMore(cms);

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
      forceShow: new Set(),
      weightUnits: props.login.profile.weightUnits,
      weight: props.login.profile.weight,
      heightUnits: props.login.profile.heightUnits,
      height: props.login.profile.height,
      waistUnits: props.login.profile.waistUnits,
      waist: props.login.profile.waist
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
      } else if (this.state[id]) {
        obj[id] = this.state[id];
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
      <DocumentTitle title="oneMore - Profile">
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
                <select ref="birthYear" required defaultValue={profile.birthYear ? profile.birthYear : ''}>
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
                <select ref="birthMonth" required defaultValue={profile.birthMonth ? profile.birthMonth : ''}>
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
                <RadioGroup name="weightUnits" value={this.state.weightUnits} onChange={v => this.setState({ weightUnits: v })}
                            className="hor-label-container">
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="lb" required/>lb
                  </label>
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="kg"/>kg
                  </label>
                </RadioGroup>
                <select id="weight" defaultValue="" value={this.state.weight} onChange={e => this.setState({ weight: e.target.value })}
                        required>
                  {!this.state.weight && <option disabled hidden value="" />}
                  {this.state.weightUnits === 'kg' && kgs.map((kg) => {
                    return <option key={'kg' + kg.value} value={kg.value}>{kg.label}</option>;
                  })}
                  {this.state.weightUnits === 'lb' && lbs.map((lb) => {
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
                <RadioGroup name="heightUnits" value={this.state.heightUnits} onChange={v => this.setState({ heightUnits: v })}
                            className="hor-label-container">
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="feet" required/>feet
                  </label>
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="cm"/>cm
                  </label>
                </RadioGroup>
                <select id="height" defaultValue="" value={this.state.height} onChange={e => this.setState({ height: e.target.value })}>
                  {!this.state.height && <option disabled hidden value="" />}
                  {this.state.heightUnits === 'feet' && feet.map((foot) => {
                    return <option key={'heightFeet' + foot.value} value={foot.value}>{foot.label}</option>;
                  })}
                  {this.state.heightUnits === 'cm' && cms.map((cm) => {
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
                <RadioGroup name="waistUnits" value={this.state.waistUnits} onChange={v => this.setState({ waistUnits: v })}
                            className="hor-label-container">
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="inches" required/>inches
                  </label>
                  <label className="hor-label">
                    <input className="hor-input" type="radio" value="cm"/>cm
                  </label>
                </RadioGroup>
                <select id="waist" defaultValue="" value={this.state.waist} onChange={e => this.setState({ waist: e.target.value })}>
                  {!this.state.waist && <option disabled hidden value="" />}
                  {this.state.waistUnits === 'inches' && waistInches.map((inch) => {
                    return <option key={'waistInches' + inch.value} value={inch.value}>{inch.label}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="small-6 large-4 columns">
              <label>
                Foreskin
                <select ref="foreskin" required defaultValue={profile.foreskin ? profile.foreskin : ''}>
                  {!profile.foreskin && <option disabled hidden value="" />}
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
