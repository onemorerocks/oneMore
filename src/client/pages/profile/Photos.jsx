import Component from 'react-pure-render/component';
import React from 'react';
import Relay from 'react-relay';
import Dropzone from 'react-dropzone';
import axios from 'axios';

class Photos extends Component {

  static propTypes = {
    login: React.PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  onDrop = (res) => {

    const promises = res.map((file) => {
      const data = new FormData();
      data.append('file', file);
      return axios.post('/api/photos', data);
    });

    Promise.all(promises).then(() => {
      this.props.relay.forceFetch();
    });
  };

  render() {
    const profile = this.props.login.profile;

    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h3>Photos</h3>
          </div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            <Dropzone onDrop={this.onDrop}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          </div>
        </div>
        <div className="row">
          {profile.photos.map((photoHash, i) => {
            const lastClass = i === profile.photos.length - 1 ? 'end' : '';
            return (
              <div key={photoHash} className={'small-12 medium-4 large-3 columns ' + lastClass}>
                <img src={`/api/photos/${photoHash}?size=small`} />
              </div>
            );
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
