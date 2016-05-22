import Component from 'react-pure-render/component';
import React from 'react';
import classnames from 'classnames';
import styles from './profile.scss';

export default class FormGroup extends Component {

  static propTypes = {
    className: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="column">
        <fieldset className={classnames('fieldset', styles.fieldset, this.props.className)}>
          {this.props.children}
        </fieldset>
      </div>
    );
  }
}
