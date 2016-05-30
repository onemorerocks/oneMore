import Component from 'react-pure-render/component';
import React from 'react';
import Modal from 'react-modal';
import ReactSelect from 'react-select';
import { Row, Column } from 'react-foundation';

import cssModules from '../../lib/cssModules';
import styles from './photos.scss';

const years = [];
for (let i = 2016; i >= 1930; i--) {
  years.push(i);
}

export const photoContentModel = [
  {
    label: 'Ass',
    value: 'ass'
  },
  {
    label: 'Body (shirtless / nude)',
    value: 'body'
  },
  {
    label: 'Cock',
    value: 'cock'
  },
  {
    label: 'Face',
    value: 'face'
  },
  {
    label: 'Other',
    value: 'other'
  }
];

class Photos extends Component {

  static propTypes = {
    photo: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      content: props.photo.content ? props.photo.content : [],
      photoHash: props.photo.hash,
      showPhoto: false
    };
  }

  thumbnailHandler = (event) => {
    this.setState({ showPhoto: event.target.name });
  };

  modalClickHandler = (event) => {
    this.setState({ showPhoto: null });
  };

  _handleOnChange = (state) => {
    this.setState(state);
  };

  _handleOnPhotoChange = (state) => {
    const valuesArray = state.map(({ value }) => value);
    this._handleOnChange({ content: valuesArray });
  };

  render() {
    if (!this.state.photoHash) {
      return null;
    }
    return (
      <div>
        <Modal isOpen={!!this.state.showPhoto}>
          <div styleName="modelPhotoContainer" style={{ backgroundImage: `url(/api/photos/${this.state.showPhoto})` }}
               onClick={this.modalClickHandler} />
        </Modal>
        <Row>
          <Column>
            <img className="thumbnail" src={`/api/photos/${this.state.photoHash}?size=442x332`} onClick={this.thumbnailHandler}
                 name={this.state.photoHash} alt="profile thumbnail" styleName="thumbnail" />
          </Column>
        </Row>
        <Row>
          <Column>
            <ReactSelect multi options={photoContentModel} clearable={false} placeholder="This is a pic of my"
                         styleName="photo-select" value={this.state.content} onChange={this._handleOnPhotoChange} />
          </Column>
        </Row>
        <Row>
          <Column>
            <select required onChange={this._handleOnYearChange}>
              <option disabled value="">What year was this photo taken?</option>
              {years.map((year) =>
                <option key={year} value={year}>{year}</option>
              )}
            </select>
          </Column>
        </Row>
        <Row>
          <Column>
            <input type="button" value="Make Primary" className="button" styleName="photo-btn" />
          </Column>
          <Column>
            <input type="button" value="Delete" className="button" styleName="photo-btn" />
          </Column>
        </Row>
      </div>
    );
  }
}

export default cssModules(Photos, styles);
