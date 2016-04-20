import Component from 'react-pure-render/component';
import React from 'react';
import RadioGroup from 'react-radio';
import classnames from 'classnames';
import cssModules from '../lib/cssModules';
import styles from './stars.scss';

const stars = [5, 4, 3, 2, 1];

class Stars extends Component {

  static propTypes = {
    id: React.PropTypes.string,
    value: React.PropTypes.any,
    setState: React.PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  getValue() {
    return stars.find((star) => {
      const value = this.refs['i' + star].checked;
      if (value) {
        return true;
      }
      return false;
    });
  }

  _handleChange = (value) => {
    const obj = {};
    obj[this.props.id] = parseInt(value, 10);
    this.props.setState(obj);
  };

  render() {
    const id = this.props.id;
    return (
      <div>
        <div styleName="star-rating">
          <RadioGroup name={id} value={this.props.value} onChange={this._handleChange}>
            {stars.map((count, i) =>
              [
                <input styleName={classnames('input-star', { [`input-star-${count}`]: count === 1 })} id={id + count} type="radio"
                       name={'star-' + id} value={5 - i} />,
                <label styleName={classnames('label-star', { [`label-star-${count}`]: count === 1 })} htmlFor={id + count} />
              ]
            )}
          </RadioGroup>
        </div>
      </div>
    );
  }

}

export default cssModules(Stars, styles);
