import {
  GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLBoolean
  //,GraphQLID, GraphQLList, GraphQLNonNull
} from 'graphql';

import {
  fromGlobalId, globalIdField, nodeDefinitions
  //connectionArgs, connectionDefinitions, connectionFromArray, mutationWithClientMutationId
} from 'graphql-relay';

import {getLogin, getLoginByReq} from './dataService';

/**
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve a node object to its GraphQL type.
 */
const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Login') {
      return getLogin(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj.email) {
      return loginType;
    } else {
      return null;
    }
  }
);

const loginType = new GraphQLObjectType({
  name: 'Login',
  description: 'A user login',
  fields: () => ({
    id: globalIdField('Login'),
    email: {
      type: GraphQLString
    },
    emailVerified: {
      type: GraphQLBoolean
    }
  }),
  interfaces: [nodeInterface]
});

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      login: {
        type: loginType,
        resolve: (jwt) => getLoginByReq(jwt)
      },
      node: nodeField
    })
  })
});
