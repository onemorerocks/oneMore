import {
  GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLInt, GraphQLFloat, GraphQLList
  // GraphQLID
} from 'graphql';

import {
  fromGlobalId, globalIdField, nodeDefinitions, mutationWithClientMutationId
  // connectionArgs, connectionDefinitions, connectionFromArray
} from 'graphql-relay';

import { getLogin, getLoginByReq, getProfile, updateProfile, queryProfiles } from './dataService';

import {
  kinkIds, starIds, profileStringFields, profileIntFields, profileNumberFields, profileStringListFields
} from '../../common/profileModel';

/**
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve a node object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, token) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Login') {
      return getLogin(token.email);
    } else if (type === 'Profile') {
      return getProfile(id, true);
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

const profileInputFields = {};

kinkIds.forEach((id) => {
  profileInputFields[id] = { type: GraphQLInt };
});

starIds.forEach((id) => {
  profileInputFields[id] = { type: GraphQLInt };
});

profileIntFields.forEach((id) => {
  profileInputFields[id] = { type: GraphQLInt };
});

profileStringFields.forEach((id) => {
  profileInputFields[id] = { type: GraphQLString };
});

profileNumberFields.forEach((id) => {
  profileInputFields[id] = { type: GraphQLFloat };
});

profileStringListFields.forEach((id) => {
  profileInputFields[id] = { type: new GraphQLList(GraphQLString) };
});

const profileFieldObj = {
  id: globalIdField('Profile'),
  age: { type: GraphQLInt },
  photos: {
    type: new GraphQLList(new GraphQLObjectType({
      name: 'Photo',
      fields: () => ({
        hash: {
          type: GraphQLString
        },
        content: {
          type: new GraphQLList(GraphQLString)
        },
        year: {
          type: GraphQLInt
        },
        private: {
          type: GraphQLBoolean
        }
      })
    }))
  },
  mainPhotoHash: { type: GraphQLString }
};

const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => (Object.assign(profileFieldObj, profileInputFields)),
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
    },
    profileSearch: {
      type: new GraphQLList(profileType),
      args: {
        query: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (jwt, { query }) => queryProfiles(query)
    },
    getProfile: {
      type: profileType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (jwt, { id }) => {
        const decoded = fromGlobalId(id);
        return getProfile(decoded.id, true);
      }
    }
  }),
  interfaces: [nodeInterface]
});

const profileMutation = mutationWithClientMutationId({
  name: 'MutateProfile',
  inputFields: profileInputFields,
  outputFields: {
    updatedProfile: {
      type: profileType,
      resolve: (input, _, token) => updateProfile(token, input)
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
