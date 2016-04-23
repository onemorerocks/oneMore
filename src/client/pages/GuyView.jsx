import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import cssModules from 'react-css-modules';
import styles from './guyView.scss';
import { Row, Column } from 'react-foundation';
import { enums } from '../../common/profileModel';

const LabelAndValue = cssModules((props) => (
  <div styleName="label-value-container">
    <div styleName="label">{props.label}</div>
    <div>{props.value}</div>
  </div>
), styles);

LabelAndValue.propTypes = {
  label: React.PropTypes.string,
  value: React.PropTypes.any
};

class GuyView extends Component {

  static propTypes = {
    login: React.PropTypes.object,
    profileId: React.PropTypes.string,
    relay: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    if (process.env.IS_BROWSER && props.profileId) {
      props.relay.setVariables({
        id: props.profileId
      });
    }
  }

  render() {
    const profile = this.props.login.getProfile;
    const prefs = this.props.login.profile;

    if (!profile || !profile.id) {
      return null;
    }

    const weight = prefs.weightUnits === 'kg' ? Math.round(profile.weight) : Math.round(profile.weight * 2.20462);
    const waist = prefs.waistUnits === 'cm' ? Math.round(profile.waist) + ' cm' : Math.round(profile.waist * 0.393701) + '"';
    const cockLength = prefs.cockUnits === 'cm' ? Math.round(profile.cockLength) + ' cm' :
    (Math.round(profile.cockLength * 0.393701 * 2) / 2) + '"';
    const cockGirth = prefs.cockUnits === 'cm' ? Math.round(profile.cockGirth) + ' cm' :
    (Math.round(profile.cockGirth * 0.393701 * 4) / 4) + '"';

    let height;
    if (prefs.heightUnits === 'cm') {
      height = Math.round(profile.height) + ' cm';
    } else {
      const inchesTotal = Math.round(profile.height * 0.393701);
      const foot = Math.floor(inchesTotal / 12);
      const inches = inchesTotal - foot * 12;
      height = foot + '\'' + inches + '"';
    }

    let ethnicity = enums.ethnicity[profile.ethnicity];
    if (profile.mixEthnicity) {
      ethnicity += ' & ' + enums.ethnicity[profile.mixEthnicity];
    }

    return (
      <DocumentTitle title="oneMore - Guys">
        <Row>
          <Column key={profile.id} small={12}>
            <h1>
              {profile.nickname}
            </h1>
          </Column>
          <Column small={12} medium={6} large={4}>
            {profile.photos && profile.photos.map((photoHash, i) => {
              if (photoHash) {
                return (
                  <div key={photoHash} key={'photo' + i}>
                    <img className="thumbnail" src={`/api/photos/${photoHash}?size=208x208`} onClick={this.thumbnailHandler}
                         name={photoHash} />
                  </div>
                );
              } else {
                return null;
              }
            })}
          </Column>
          <Column small={12} medium={6} large={4}>
            <LabelAndValue label="Age" value={profile.age} />
            <LabelAndValue label="Ethnicity" value={ethnicity} />
            <LabelAndValue label="HIV Status" value={enums.hiv[profile.hiv]} />
            <LabelAndValue label="Eye Color" value={enums.eye[profile.eye]} />
            <LabelAndValue label="Safer Sex" value={enums.safer[profile.safer]} />
            <LabelAndValue label="Mannerisms & Speech" value={enums.masc[profile.masc]} />
            <LabelAndValue label="Voice" value={enums.voice[profile.voice]} />
            <LabelAndValue label="Hair" value={enums.hair[profile.hair]} />
            <LabelAndValue label="Body Hair" value={enums.bodyHair[profile.bodyHair]} />
            <LabelAndValue label="Facial Hair" value={enums.facialHair[profile.facialHair]} />
            <LabelAndValue label="Smokes" value={enums.smokes[profile.smokes]} />
            <LabelAndValue label="Discretion" value={enums.discretion[profile.discretion]} />
            <LabelAndValue label="Description" value={profile.description} />
          </Column>
          <Column small={12} medium={6} large={4}>
            <LabelAndValue label="Weight" value={weight + ' ' + prefs.weightUnits} />
            <LabelAndValue label="Height" value={height} />
            <LabelAndValue label="Waist" value={waist} />
            <LabelAndValue label="Cock Length" value={cockLength} />
            <LabelAndValue label="Cock Girth" value={cockGirth} />
            <LabelAndValue label="Foreskin" value={enums.foreskin[profile.foreskin]} />
          </Column>
        </Row>
      </DocumentTitle>
    );
  }

}

export default Relay.createContainer(cssModules(GuyView, styles), {

  initialVariables: {
    id: ''
  },

  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        profile {
          weightUnits,
          heightUnits,
          waistUnits,
          cockUnits
        },
        getProfile(id: $id) {
          id,
          nickname,
          photos,
          weight,
          age,
          weight,
          height,
          waist,
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
