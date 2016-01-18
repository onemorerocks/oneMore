import Component from 'react-pure-render/component';
import React from 'react';
import BrowserOnly from './BrowserOnly';

let AlertContainer = null;
if (process.env.IS_BROWSER) {
  AlertContainer = require('react-alert');
}

export default class FormErrors extends Component {

  constructor(props) {
    super(props);
  }

  static alertOptions = {
    offset: 14,
    position: 'bottom right',
    theme: 'dark',
    time: 2500,
    transition: 'scale'
  };

  render() {

    let errorElement = null;

    if (this.props.errors.length > 0) {
      errorElement = (
        <div className="alert callout">
          <ul>
            {this.props.errors.map((error, index) => {
              return <li key={'error' + index} dangerouslySetInnerHTML={{ __html: error }}/>;
            })}
          </ul>
        </div>);
    }

    return (
      <div>
        <BrowserOnly>
          <AlertContainer ref={(a) => global.msg = a} {...FormErrors.alertOptions} />
        </BrowserOnly>
        {errorElement}
      </div>
    );
  }

}

FormErrors.propTypes = {
  errors: React.PropTypes.array
};
