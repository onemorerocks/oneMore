import Component from 'react-pure-render/component';
import React from 'react';

export default class BrowserOnly extends Component {

  constructor(props) {
    super(props);
    this.state = { showChildren: false };
  }

  componentDidMount() {
    if (!this.state.showChildren) {
      this.setState({ showChildren: true }); // eslint-disable-line
    }
  }

  render() {
    if (this.state.showChildren) {
      return <div>{this.props.children}</div>;
    } else {
      return null;
    }
  }

}
