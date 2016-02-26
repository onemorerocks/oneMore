import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import { Link } from 'react-router';
import LoginTopBar from '../components/LoginTopBar.jsx';

export default class Home extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <DocumentTitle title="StickyBros">
        <div>
          <LoginTopBar />
          <div className="row">
            <div className="small-12 columns">
              <div className="text-center">
                <h1>Get Your Bros Sticky</h1>
                <img src="http://hot-disney-cartoon.com/gay/Gay-park-orgy.jpg" />
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
