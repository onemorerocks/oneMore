import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Request from 'axios';

import FormErrors from '../components/formErrors.react';

export default class SignupIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password1: '',
      password2: '',
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

    const errors = [];

    if (this.state.password1 !== this.state.password2) {
      errors.push('Passwords do not match');
    }

    if (this.state.password1.length < 8) {
      errors.push('Passwords must be at least 8 characters');
    }

    this.setState({errors: errors});

    if (errors.length === 0) {

      this.setState({submitDisabled: true});

      Request.post('/api/signup', {
        email: this.state.email,
        password: this.state.password1
      }).then((result) => {
        this.setState({submitDisabled: false});
      }).catch((err) => {
        if (err.status === 409) {
          this.setState({errors: ['That email has already been registered.'], submitDisabled: false});
        } else if (err.status === 403) {
          this.setState({errors: ['That password is hackable.  Try another.'], submitDisabled: false});
        } else {
          this.setState({errors: ['There was a server side error.'], submitDisabled: false});
        }
      });
    }

  }

  render() {

    const state = this.state;

    return (
      <DocumentTitle title="StickyBros - Sign Up">
        <div className="row">
          <div className="small-12 columns">
            <h1>Sign Up</h1>
            <FormErrors errors={state.errors} />
            <form onSubmit={this.submit}>

              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" value={state.email} onChange={this.handleChange('email')}
                     required="true" placeholder="example@address.com" maxLength="100"/>

              <label htmlFor="password1">Password</label>
              <input id="password1" type="password" value={state.password1}
                     onChange={this.handleChange('password1')} required="true" placeholder="Enter Password"
                     maxLength="100"/>

              <label htmlFor="password2">Confirm Password</label>
              <input id="password2" type="password" value={state.password2}
                     onChange={this.handleChange('password2')} required="true" placeholder="Reenter Password"
                     maxLength="100"/>

              <input disabled={state.submitDisabled} className="button" type="submit" value="Sign Up"/>
            </form>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}
