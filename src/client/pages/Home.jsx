import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import { Link } from 'react-router';
import { TopBar } from '../components/TopBar.jsx';

export default class Home extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <DocumentTitle title="oneMore">
        <div>
          <TopBar showLogin />
          <div className="row">
            <div className="small-12 columns">
              <div className="text-center">
                <h1>Why not invite one more?</h1>
                <img src="http://hot-disney-cartoon.com/gay/Gay-park-orgy.jpg" alt="Welcome" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="small-12 columns">
              <div className="text-center">
                <p>Not a member?  Signup free.</p>
                <Link className="medium button" to="/signup">Signup</Link>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}
