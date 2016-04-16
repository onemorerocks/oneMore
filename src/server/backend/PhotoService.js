import request from 'request';
import config from '../config';
import newError from './newError';
import { addPhoto } from './dataService';

export default class PhotoService {

  _uploadToThumbor(stream) {
    return new Promise((resolve, reject) => {
      stream.pipe(request.post(config.thumborUrl + '/image', (error, response, body) => {
        if (error) {
          return reject(newError('thumbor upload error', error));
        }
        if (response.statusCode !== 201) {
          const err = newError(
            'thumbor upload error, httpStatus:' + response.statusCode + '\n' + JSON.stringify(response.headers) + '\n' + body);
          return reject(err);
        }
        return resolve(response.headers.location);
      }));
    });
  }

  store(stream, jwt) {
    return this._uploadToThumbor(stream).then((location) => {
      const hashAndImg = location.replace('/image/', '');
      const hash = hashAndImg.substring(0, hashAndImg.indexOf('/'));
      return addPhoto(jwt, hash);
    });
  }

  doGet(path) {
    return new Promise((resolve, reject) => {

      const options = {
        url: config.thumborUrl + path,
        timeout: 5000
      };

      request.get(options)
        .on('response', (response) => {
          if (response.statusCode !== 200) {
            const err = newError(
              'thumbor get error, httpStatus:' + response.statusCode + '\n' + JSON.stringify(response.headers));
            return reject(err);
          }
          return resolve(response);
        })
        .on('error', (error) => {
          reject(newError(error));
        });
    });
  }

  get(hash, size, accept) {

    let sizeParams = '';

    if (size) {
      sizeParams = '/' + size;
    }

    const format = accept.indexOf('webp') !== -1 ? 'webp' : 'jpeg';
    const filter = `filters:format(${format})`;

    const path = `/unsafe${sizeParams}/smart/${filter}/` + hash;
    return this.doGet(path);
  }

  getMeta(hash) {
    const path = '/unsafe/meta/smart/' + hash;
    return this.doGet(path);
  }

}
