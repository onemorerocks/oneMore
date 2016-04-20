import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import Request from 'axios';
import FormErrors from '../components/FormErrors.jsx';
import cssModules from '../lib/cssModules';

import styles from './signup.scss';

class Signup extends Component {

  static propTypes = {
    history: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password1: '',
      password2: '',
      nickname: '',
      errors: [],
      submitDisabled: false,
      agreeChecked: false
    };
  }

  handleChange = (prop) => {
    return (event) => {
      const newState = {};
      let value = event.target.value;

      if (event.target.type === 'checkbox') {
        value = event.target.checked;
      }

      newState[prop] = value;
      this.setState(newState);
    };
  };

  submit = (event) => {
    event.preventDefault();
    if (!this.state.agreeChecked || this.state.submitDisabled) {
      return;
    }

    const errors = [];

    if (this.state.password1 !== this.state.password2) {
      errors.push('Passwords do not match');
    }

    if (this.state.password1.length < 8) {
      errors.push('Passwords must be at least 8 characters');
    }

    if (this.state.nickname.length < 2) {
      errors.push('Nickname must be at least 2 characters');
    }

    this.setState({ errors });

    if (errors.length === 0) {
      this._sendData();
    }
  };

  _sendData() {
    this.setState({ submitDisabled: true });

    Request.post('/api/signup', {
      email: this.state.email,
      password: this.state.password1,
      nickname: this.state.nickname
    }).then((result) => {
      this.setState({ submitDisabled: false });
      window.location.href = '/';
    }).catch((err) => {
      if (err.status === 409) {
        this.setState({ errors: ['That email has already been registered.'], submitDisabled: false });
      } else if (err.status === 403) {
        this.setState({
          errors: [
            `That password is vulnerable to dictionary attacks.  Try another.<br />(A dictionary attack is a hacking
              technique which uses a list of common passwords in an attempt to guess the user's password.)`],
          submitDisabled: false
        });
      } else if (err.status === 422) {
        this.setState({
          errors: ["Tried sending another verification email out, but your password didn't match the old one."],
          submitDisabled: false
        });
      } else if (err.status === 499) {
        this.setState({
          errors: ["Your password can't match your email address."],
          submitDisabled: false
        });
      } else {
        this.setState({ errors: ['There was a server side error.'], submitDisabled: false });
      }
    });
  }

  render() {

    const state = this.state;

    return (
      <DocumentTitle title="oneMore - Sign Up">
        <div className="row">
          <div className="small-12 columns">
            <h1>Sign Up</h1>
            <FormErrors errors={state.errors} />
            <form onSubmit={this.submit}>

              <label htmlFor="email">Email Address (People won't see this)</label>
              <input id="email" type="email" value={state.email} onChange={this.handleChange('email')}
                     required="true" placeholder="example@address.com" maxLength="100" />

              <label htmlFor="nickname">Nickname (People WILL see this)</label>
              <input id="nickname" type="text" value={state.nickname} onChange={this.handleChange('nickname')}
                     required="true" placeholder="e.g. Handsome Joe" maxLength="20" />

              <label htmlFor="password1">Password</label>
              <input id="password1" type="password" value={state.password1}
                     onChange={this.handleChange('password1')} required="true" placeholder="Enter Password"
                     maxLength="100" />

              <label htmlFor="password2">Confirm Password</label>
              <input id="password2" type="password" value={state.password2}
                     onChange={this.handleChange('password2')} required="true" placeholder="Reenter Password"
                     maxLength="100" />

              <label styleName="agreeCheckbox">
                <input type="checkbox" value={state.agreeChecked} onChange={this.handleChange('agreeChecked')} />
                I am at least 18 years and I accept the Terms-of-Service Agreement.
              </label>

              <input disabled={state.submitDisabled || !state.agreeChecked} className="button" type="submit" value="Sign Up" />
            </form>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}

export default cssModules(Signup, styles);
