import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import classnames from 'classnames';
import styles from './topBar.scss';

export class TopBar extends Component {

  static propTypes = {
    login: React.PropTypes.shape({
      email: React.PropTypes.string
    }),
    showLogin: React.PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  _handleLogout = () => {
    window.location.href = '/api/logout';
  };

  render() {
    return (
      <div className="title-bar">
        <div className="title-bar-left">
          <Link to="/">
            <span className={classnames(styles.title)}>one<span className={styles.captialized}>More</span></span>
          </Link>
        </div>
        <div className="title-bar-right">
          {this.props.login && <span className={classnames(styles.email, 'show-for-medium')}>{this.props.login.email}</span>}
          {this.props.showLogin && <Link className={classnames('medium', 'button', styles.button)} to="/login">Login</Link>}
          {!this.props.showLogin && <button className={classnames('small', 'button', styles.button)}
                                            onClick={this._handleLogout}>Logout</button>}
        </div>
      </div>
    );
  }

}

export default Relay.createContainer(TopBar, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        email,
      }
    `
  }
});
