import Component from 'react-pure-render/component';
import React from 'react';
import RadioGroup from 'react-radio';
import './stars.scss';

const stars = [5, 4, 3, 2, 1];

export default class Stars extends Component {

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
    obj[this.props.id] = value;
    this.props.setState(obj);
  };

  render() {
    const id = this.props.id;
    return (
      <div>
        <div className="star-rating">
          <RadioGroup name={id} value={this.props.value} onChange={this._handleChange}>
            {stars.map((count, i) =>
              [
                <input className={'input-star input-star-' + count} id={id + count} type="radio" name={'star-' + id} value={5 - i} />,
                <label className={'label-star label-star-' + count} htmlFor={id + count} />
              ]
            )}
          </RadioGroup>
        </div>
      </div>
    );
  }

}
