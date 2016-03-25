import request from 'request';
import config from '../config';
import newError from './newError';
import { addPhoto } from './dataService';

export default class PhotoUploadService {

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
      return addPhoto(jwt, location.replace('/image/', ''));
    });
  }

}
