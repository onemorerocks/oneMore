import {
  GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLID, GraphQLInt
  // GraphQLList
} from 'graphql';

import {
  fromGlobalId, globalIdField, nodeDefinitions, mutationWithClientMutationId
  // connectionArgs, connectionDefinitions, connectionFromArray
} from 'graphql-relay';

import { getLogin, getLoginByReq, getProfile, updateProfile } from './dataService';

/**
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve a node object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Login') {
      return getLogin(id);
    } else if (type === 'Profile') {
      return getProfile(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj.email) {
      return loginType; // eslint-disable-line
    } else if (obj.nickname) {
      return profileType; // eslint-disable-line
    } else {
      return null;
    }
  }
);

const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: globalIdField('Profile'),
    nickname: { type: GraphQLString },
    givesHead: { type: GraphQLInt }
  }),
  interfaces: [nodeInterface]
});

const loginType = new GraphQLObjectType({
  name: 'Login',
  fields: () => ({
    id: globalIdField('Login'),
    email: {
      type: GraphQLString
    },
    emailVerified: {
      type: GraphQLBoolean
    },
    profile: {
      type: profileType
    }
  }),
  interfaces: [nodeInterface]
});

const profileMutation = mutationWithClientMutationId({
  name: 'MutateProfile',
  inputFields: {
    nickname: { type: GraphQLString },
    givesHead: { type: GraphQLInt }
  },
  outputFields: {
    updatedProfile: {
      type: profileType,
      resolve: (input, _, { rootValue }) => updateProfile(rootValue, input)
    }
  },
  mutateAndGetPayload: (input) => {
    return input;
  }
});

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      login: {
        type: loginType,
        resolve: (jwt) => getLoginByReq(jwt)
      },
      profile: {
        type: profileType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLID)
          }
        },
        resolve: (jwt, { id }) => getProfile(id)
      },
      node: nodeField
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      updateProfile: profileMutation
    })
  })
});
