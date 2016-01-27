import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Relay from 'react-relay';

import './home.scss';

class SignedInHome extends Component {

  static propTypes = {
    login: React.PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title="StickyBros - Home">
        <div>
          <div className="row">
            <div className="small-12 columns">
              <div>Signed in</div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}

export default Relay.createContainer(SignedInHome, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        email
      }
    `
  }
});
