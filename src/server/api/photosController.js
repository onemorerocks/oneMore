import PhotoUploadService from '../backend/PhotoUploadService';
import Auth from '../backend/Auth';

const service = new PhotoUploadService();
const auth = new Auth();

export default function photosController(req, reply) {

  const token = req.state.token ? req.state.token : req.headers.token;

  const promise = auth.validateEncodedJwt(token).then((jwt) => {
    return service.store(req.payload.file, jwt);
  });

  reply(promise);
}
