import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

class Guys extends Component {

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

    return (
      <DocumentTitle title="oneMore - Guys">
        <div className="row">
          <div key={profile.id} className={'small-12 columns'}>
            <div>
              {profile.photos && profile.photos.map((photoHash, i) => {
                if (photoHash) {
                  const lastClass = i === profile.photos.length - 1 ? 'end' : '';
                  return (
                    <div key={photoHash} className={'small-12 medium-4 large-3 columns ' + lastClass} key={'photo' + i}>
                      <img className="thumbnail" src={`/api/photos/${photoHash}?size=208x208`} onClick={this.thumbnailHandler}
                           name={photoHash} />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
            <div>
              {profile.nickname}
            </div>
            <div>
              {weight} {prefs.weightUnits}
            </div>
            <div>
              {height}
            </div>
            <div>
              {waist}
            </div>
            <div>
              {cockLength}
            </div>
            <div>
              {cockGirth}
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}

export default Relay.createContainer(Guys, {

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
          birthMonth,
          birthYear,
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
