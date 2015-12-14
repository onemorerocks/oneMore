import Component from 'react-pure-render/component';
import React from 'react';

export default class TextBlock extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div dangerouslySetInnerHTML={{__html: this.props.text}}></div>
    );
  }

}

TextBlock.propTypes = {
  text: React.PropTypes.string
};
