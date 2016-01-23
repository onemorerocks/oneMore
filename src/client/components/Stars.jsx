import Component from 'react-pure-render/component';
import React from 'react';

import './stars.scss';

const stars = [5, 4, 3, 2, 1];

export default class Stars extends Component {

  static propTypes = {
    id: React.PropTypes.string,
    defaultValue: React.PropTypes.number
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
    });
  }

  render() {
    const id = this.props.id;
    return (
      <div>
        <div className="star-rating">
          {stars.map((count) =>
            [
              <input className={'input-star input-star-' + count} id={id + count} type="radio" name={'star-' + id}
                     defaultChecked={count === this.props.defaultValue} ref={'i' + count}/>,
              <label className={'label-star label-star-' + count} htmlFor={id + count}/>
            ]
          )}
        </div>
      </div>
    );
  }

}
