import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Modal from 'react-modal';

import './photos.scss';

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

  thumbnailHandler = (event) => {
    this.setState({ showPhoto: event.target.name });
  };

  modalClickHandler = (event) => {
    this.setState({ showPhoto: null });
  };

  render() {
    const profile = this.props.login.profile;

    return (
      <div>
        <Modal isOpen={!!this.state.showPhoto}>
          <div className="modelPhotoContainer" style={{ backgroundImage: `url(/api/photos/${this.state.showPhoto})` }}
               onClick={this.modalClickHandler} />
        </Modal>
        <div className="row">
          <div className="small-12 columns">
            <h3>Photos</h3>
          </div>
        </div>
        <div className="row">
          <div className="small-12 medium-4 large-3 columns">
            {!this.state.isUploading && <Dropzone onDrop={this.onDrop} accept="image/*" className="dropzone">
              <div>Drag and drop photos here, or click to select photos to upload.</div>
            </Dropzone>}
            {this.state.isUploading && <div className="dropzone gears"><img src="/assets/img/gears.svg" className="gearsImg" /></div>}
          </div>
          {profile.photos && profile.photos.map((photoHash, i) => {
            if (photoHash) {
              const lastClass = i === profile.photos.length - 1 ? 'end' : '';
              return (
                <div key={photoHash} className={'small-12 medium-4 large-3 columns ' + lastClass} key={'photo' + i}>
                  <img className="thumbnail" src={`/api/photos/${photoHash}?size=208x208`} onClick={this.thumbnailHandler}
                       name={photoHash} />
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Photos, {
  fragments: {
    login: () => Relay.QL`
      fragment on Login {
        profile {
          photos
        }
      }
    `
  }
});
