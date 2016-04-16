import PhotoService from '../backend/PhotoService';
import Auth from '../backend/Auth';

const service = new PhotoService();
const auth = new Auth();

export const photosControllerPost = (req, reply) => {

  const token = req.state.token ? req.state.token : req.headers.token;

  const promise = auth.validateEncodedJwt(token).then((jwt) => {
    return service.store(req.payload.file, jwt);
  });

  reply(promise);
};

export const photosControllerGet = (req, reply) => {

  const token = req.state.token ? req.state.token : req.headers.token;
  const hash = req.params.hash;
  const size = req.query.size;
  const accept = req.headers.accept;

  const promise = auth.validateEncodedJwt(token).then((jwt) => {
    return service.get(hash, size, accept);
  });

  reply(promise);
};

export const photosControllerGetMeta = (req, reply) => {

  const token = req.state.token ? req.state.token : req.headers.token;
  const hash = req.params.hash;

  const promise = auth.validateEncodedJwt(token).then((jwt) => {
    return service.getMeta(hash);
  });

  reply(promise);
};
