import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Relay from 'react-relay';

import TopBar from '../components/TopBar.react';

class EmailSent extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    login: React.PropTypes.object
  };

  render() {
    return (
      <DocumentTitle title="StickyBros - Email Sent">
        <div className="row">
          <TopBar login={this.props.login} />
          <div className="small-12 columns">
            <p>Alright, cool. We sent a verification email to your address.</p>
            <p>If you don't see it after a few minutes, check your spam folder.</p>
            <p>Still can't find it?  Just signup again and another email will go out.</p>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}

export default Relay.createContainer(EmailSent, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        ${TopBar.getFragment('login')}
      }
    `
  }
});
