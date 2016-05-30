import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Modal from 'react-modal';
import { Row, Column } from 'react-foundation';

import PhotoView from './PhotoView';
import cssModules from '../../lib/cssModules';
import styles from './photos.scss';

class Photos extends Component {

  static propTypes = {
    login: React.PropTypes.object,
    relay: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      isUploading: false
    };
  }

  onDrop = (res) => {

    this.setState({ isUploading: true });

    const promises = res.map((file) => {
      const data = new FormData();
      data.append('file', file);
      return axios.post('/api/photos', data);
    });

    Promise.all(promises).then(() => {
      this.props.relay.forceFetch();
      this.setState({ isUploading: false });
    });
  };

  render() {
    const profile = this.props.login.profile;

    return (
      <div>
        <Modal isOpen={!!this.state.showPhoto}>
          <div styleName="modelPhotoContainer" style={{ backgroundImage: `url(/api/photos/${this.state.showPhoto})` }}
               onClick={this.modalClickHandler} />
        </Modal>
        <div className="row">
          <div className="small-12 columns">
            <h3>Photos</h3>
          </div>
        </div>
        <Row upOnLarge={3} upOnMedium={2} upOnSmall={1} verticalAlignment="stretch">
          <Column>
            {!this.state.isUploading && <Dropzone onDrop={this.onDrop} accept="image/*" className={styles.dropzone}>
              <div>Drag and drop photos here, or click to select photos to upload.</div>
            </Dropzone>}
            {this.state.isUploading && <div
              styleName="dropzone gears"><img src="/assets/img/gears.svg" className="gearsImg" alt="loading" /></div>
            }
          </Column>
          {profile.photos && profile.photos.map((photo, i) => {
            if (photo) {
              return (
                <Column key={'photo' + i}>
                  <PhotoView photo={photo} />
                </Column>
              );
            } else {
              return null;
            }
          })}
        </Row>
      </div>
    );
  }
}

export default Relay.createContainer(cssModules(Photos, styles), {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        profile {
          photos {
            hash,
            content
          }
        }
      }
    `
  }
});
