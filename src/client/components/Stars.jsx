import Component from 'react-pure-render/component';
import React from 'react';

import './stars.scss';

export default class Stars extends Component {

  static propTypes = {
    id: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const id = this.props.id;
    const stars = [5, 4, 3, 2, 1];
    return (
      <div className="star-rating">
        {stars.map((count) =>
          [
            <input className={'input-star input-star-' + count} id={id + count} type="radio" name="star"/>,
            <label className={'label-star label-star-' + count} htmlFor={id + count}/>
          ]
        )}
      </div>
    );
  }

}
