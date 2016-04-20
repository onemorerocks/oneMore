import Component from 'react-pure-render/component';
import React from 'react';
import FormGroup from './FormGroup.jsx';
import Stars from '../../components/Stars.jsx';
import styles from './profile.scss';
import cssModules from '../../lib/cssModules';

class StarGroup extends Component {

  static propTypes = {
    groupModel: React.PropTypes.object,
    data: React.PropTypes.object,
    onChange: React.PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  stars = (name) => <Stars id={name} value={this.props.data[name]} setState={this.props.onChange} />;

  render() {
    const groupModel = this.props.groupModel;
    return (
      <FormGroup key={groupModel.group}>
        {groupModel.rows.map((rowModel) => {
          const value = this.props.data[rowModel.id];
          let feeling = '?';
          if (value === 1) {
            feeling = "don't like";
          } else if (value === 2) {
            feeling = 'rarely like';
          } else if (value === 3) {
            feeling = 'sometimes like';
          } else if (value === 4) {
            feeling = 'enjoy';
          } else if (value === 5) {
            feeling = 'love';
          }
          return (
            <span key={rowModel.id}>
              {!value && <span>Do you like <strong>{rowModel.text}</strong>?</span>}
              {!!value && <span>I <span styleName="feeling">{feeling}</span> <strong>{rowModel.text}</strong></span>}
              {this.stars(rowModel.id)}
            </span>
          );
        })}
      </FormGroup>
    );
  }
}

export default cssModules(StarGroup, styles);
