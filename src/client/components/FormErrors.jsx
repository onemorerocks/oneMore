import Component from 'react-pure-render/component';
import React from 'react';

export default class FormErrors extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let errorElement = <noscript />;

    if (this.props.errors.length > 0) {
      errorElement = (
        <div className="alert callout">
          <ul>
            {this.props.errors.map((error, index) => {
              return <li key={'error' + index} dangerouslySetInnerHTML={{ __html: error }} />;
            })}
          </ul>
        </div>);
    }

    return (
      <div>
        {errorElement}
      </div>
    );
  }

}

FormErrors.propTypes = {
  errors: React.PropTypes.array
};
