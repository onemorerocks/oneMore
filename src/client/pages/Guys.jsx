import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';
import GuyView from './GuyView.jsx';

class Guys extends Component {

  static propTypes = {
    login: React.PropTypes.object,
    relay: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedProfile: ''
    };
  }

  _handleSubmit = (event) => {
    event.preventDefault();
    const query = '*';
    this.setState({ selectedProfile: '' });
    this.props.relay.setVariables({
      query
    });
  };

  _findProfileId = (target) => {
    const profileId = target.getAttribute('data-profile');
    if (profileId) {
      return profileId;
    } else {
      return this._findProfileId(target.parentElement);
    }
  };

  _handleProfileClick = (event) => {
    const profileId = this._findProfileId(event.target);
    this.setState({ selectedProfile: profileId });
  };

  render() {
    const profiles = this.props.login.profileSearch;
    const selectedProfile = this.state.selectedProfile;
    return (
      <DocumentTitle title="oneMore - Guys">
        <div className="row">
          <div className="column">
            <form onSubmit={this._handleSubmit}>
              <input className="button" type="submit" value="Search" />
            </form>
          </div>
          {profiles && profiles.map((profile, i) => {

            if (profile.id === selectedProfile) {
              return (
                <div className="column" key={'view' + profile.id}>
                  <GuyView login={this.props.login} profileId={profile.id} />
                </div>
              );
            }

            const lastClass = i === profiles.length - 1 ? 'end' : '';
            return (
              <div key={profile.id} className={'small-12 medium-4 large-3 columns ' + lastClass} onClick={this._handleProfileClick}
                   data-profile={profile.id}>
                <div>
                  {profile.photos && profile.photos[0] && profile.photos[0].hash && <img
                    src={'/api/photos/' + profile.photos[0].hash + '?size=208x208'} alt="Profile" />
                  }
                </div>
                <div>
                  {profile.nickname}
                </div>
              </div>
            );
          })}
        </div>
      </DocumentTitle>
    );
  }

}

export default Relay.createContainer(Guys, {

  initialVariables: {
    query: ''
  },

  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        ${GuyView.getFragment('login')},
        profileSearch(query: $query) {
          id,
          nickname,
          photos {
            hash
          }
        }
      }
    `
  }
});
