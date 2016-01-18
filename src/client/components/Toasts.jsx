import Component from 'react-pure-render/component';
import React from 'react';
import BrowserOnly from '../components/BrowserOnly';

const alertOptions = {
  offset: 14,
  position: 'bottom right',
  theme: 'dark',
  time: 2500,
  transition: 'scale'
};

let alertElement = null;
if (process.env.IS_BROWSER) {
  const AlertContainer = require('react-alert');
  alertElement = <AlertContainer ref={(a) => global.msg = a} {...alertOptions} />;
}

export default class Toasts extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserOnly>
        {alertElement}
      </BrowserOnly>
    );
  }

}
