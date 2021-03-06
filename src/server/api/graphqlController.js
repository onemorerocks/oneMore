import { graphql } from 'graphql';
import { schema } from '../backend/graphqlSchema';
import newError from '../backend/newError';
import Auth from '../backend/Auth';

const auth = new Auth();

function doQuery(req, token) {
  const { query, variables = {} } = req.payload;
  const result = graphql(schema, query, token, token, variables);
  return result.then((data) => {
    if (data.errors) {
      console.error('Query', query); // eslint-disable-line
      console.error('Variables', variables); // eslint-disable-line
      return newError(data.errors);
    }
    return data;
  });
}

export default function graphqlController(req, reply) {

  const token = req.state.token ? req.state.token : req.headers.token;

  const promise = auth.validateEncodedJwt(token).then((jwt) => {
    return doQuery(req, jwt);
  });

  reply(promise);
}
