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
    props.relay.setVariables({
      id: props.profileId
    });
  }

  render() {
    const profile = this.props.login.getProfile;
    return (
      <DocumentTitle title="oneMore - Guys">
        <div key={profile.id} className={'small-12 columns'}>HELLO
          <div>
            {profile.photos && <img src={'/api/photos/' + profile.photos[0]} />}
          </div>
          <div>
            {profile.nickname}
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
        getProfile(id: $id) {
          id,
          nickname,
          photos
        }
      }
    `
  }
});
