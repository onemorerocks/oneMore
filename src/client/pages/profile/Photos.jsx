import Component from 'react-pure-render/component';
import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

export default class Photos extends Component {

  constructor(props) {
    super(props);
  }

  onDrop = (res) => {
    const promises = res.map((file) => {

      const data = new FormData();
      data.append('file', file);

      const percentCompleted = {};
      const config = {
        progress: (progressEvent) => {
          if (percentCompleted.onUpdate) {
            const percent = progressEvent.loaded / progressEvent.total;
            percentCompleted.onUpdate(percent);
          }
        }
      };

      const promise = axios.post('/api/photos', data, config);
      return { promise, percentCompleted };
    });

    promises.forEach(({ promise, percentCompleted }) => {
      percentCompleted.onUpdate = (percent) => {
        console.log('percent', percent);
      };
    });

  };

  render() {
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
      </div>
    );
  }
}
