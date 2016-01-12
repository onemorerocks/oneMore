import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Request from 'axios';

import FormErrors from '../components/formErrors.react.js';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: [],
      submitDisabled: false
    };
  }

  handleChange(prop) {
    return (event) => {
      const newState = {};
      newState[prop] = event.target.value;
      this.setState(newState);
    };
  }

  submit(event) {
    event.preventDefault();

    this.setState({errors: [], submitDisabled: true});

    Request.post('/api/login', {
      email: this.state.email,
      password: this.state.password
    }).then((result) => {
      window.location.href = '/';
    }).catch((err) => {
      if (err.status === 401) {
        this.setState({errors: ['Email or password was not valid'], submitDisabled: false});
      } else {
        this.setState({errors: ['There was an error on the server.  Try again shortly.'], submitDisabled: false});
      }
    });

  }

  render() {

    const state = this.state;

    return (
      <DocumentTitle title="StickyBros">
        <div className="row">
          <div className="small-12 columns">
            <div>
              <h1>Login</h1>
              <FormErrors errors={state.errors}/>
              <form onSubmit={this.submit.bind(this)}>

                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" value={state.email} onChange={this.handleChange('email')}
                       required="true" placeholder="example@address.com" maxLength="100"/>

                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={state.password}
                       onChange={this.handleChange('password')} required="true" placeholder="Enter Password"
                       maxLength="100"/>

                <input disabled={state.submitDisabled} className="button" type="submit" value="Login"/>
              </form>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}
