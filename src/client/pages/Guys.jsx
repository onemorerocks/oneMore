import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

class Guys extends Component {

  static propTypes = {
    login: React.PropTypes.object,
    relay: React.PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const query = '*';
    this.props.relay.setVariables({
      query
    });
  };

  render() {
    return (
      <DocumentTitle title="oneMore - Guys">
        <div className="row">
          <div className="column">
            <form onSubmit={this.handleSubmit}>
              <input className="button" type="submit" value="Search" />
            </form>
          </div>
          <div className="column">
            {this.props.login && this.props.login.profileSearch && this.props.login.profileSearch.map((profile) =>
              <div key={profile.id}>{profile.nickname}</div>
            )}
          </div>
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
          nickname
        }
      }
    `
  }
});
