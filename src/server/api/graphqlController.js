import {graphql} from 'graphql';
import {schema} from '../backend/graphqlSchema';
import newError from '../backend/newError';
import Auth from '../backend/auth';

const auth = new Auth();

export default function graphqlController(req, reply) {

  const token = req.state.token ? req.state.token : req.headers.token;

  const promise = auth.validateEncodedJwt(token).then((jwt) => {
    return doQuery(req, jwt);
  });

  reply(promise);
}

function doQuery(req, token) {
  const {query} = req.payload;
  const result = graphql(schema, query, token);
  return result.then((data) => {
    if (data.errors) {
      return newError(data.errors);
    }
    return data;
  });
}
