import {
  GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLID
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
    nickname: { type: GraphQLString }
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
    id: { type: new GraphQLNonNull(GraphQLID) },
    nickname: { type: GraphQLString }
  },
  outputFields: {
    profile: {
      type: profileType,
      resolve: ({ updatedProfile }) => updatedProfile
    }
  },
  mutateAndGetPayload: ({ id, nickname }) => {
    const newProfile = { id, nickname };
    return updateProfile.then(() => {
      return newProfile;
    });
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
