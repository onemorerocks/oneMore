import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

class Guys extends Component {

  static propTypes = {
    login: React.PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const profiles = this.props.login.profileSearch;
    return (
      <DocumentTitle title="oneMore - Guys">
        <div className="row">
          <div className="column">
            <form onSubmit={this.handleSubmit}>
              <input className="button" type="submit" value="Search" />
            </form>
          </div>
          {profiles && profiles.map((profile, i) => {
            const lastClass = i === profiles.length - 1 ? 'end' : '';
            return (
              <div key={profile.id} className={'small-12 medium-4 large-3 columns ' + lastClass}>
                <div>
                  {profile.photos && <img src={'/api/photos/' + profile.photos[0] + '?size=208x208'} />}
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
        profileSearch(query: $query) {
          id,
          nickname,
          photos
        }
      }
    `
  }
});
