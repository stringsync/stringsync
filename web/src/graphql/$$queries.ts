import { types } from 'typed-graphqlify';
import { Gql } from './$gql';
import { gql } from './gql';
import { GraphqlRequest } from './GraphqlRequest';
import {
  ConfirmEmailInput,
  CreateNotationInput,
  LoginInput,
  Mutation,
  Query,
  QueryNotationArgs,
  QueryNotationsArgs,
  QuerySuggestedNotationsArgs,
  ResetPasswordInput,
  SendResetPasswordEmailInput,
  SignupInput,
  UserRoles,
} from './graphqlTypes';
import { RequestNamesOf, RequestType, RequestVariables } from './types';

const req = <T extends RequestType, N extends RequestNamesOf<T>, V extends RequestVariables = void>(
  name: N,
  query: string
) => {
  return new (class extends GraphqlRequest<T, N, V> {
    name = name;
    query = query;
  })();
};

const who = Gql.query('whoami')
  .setQueryObject({
    id: types.string,
    email: types.string,
    username: types.string,
    role: types.optional.oneOf(UserRoles)!,
    confirmedAt: types.string,
  })
  .setVariablesObject({
    foo: types.string,
  })
  .build();

export const whoami = req<Query, 'whoami'>(
  'whoami',
  gql`
    query {
      whoami {
        id
        email
        username
        role
        confirmedAt
      }
    }
  `
);

export const login = req<Mutation, 'login', { input: LoginInput }>(
  'login',
  gql`
    mutation login($input: LoginInput!) {
      login(input: $input) {
        id
        email
        username
        role
        confirmedAt
      }
    }
  `
);

export const logout = req<Mutation, 'logout'>(
  'logout',
  gql`
    mutation logout {
      logout
    }
  `
);

export const signup = req<Mutation, 'signup', { input: SignupInput }>(
  'signup',
  gql`
    mutation signup($input: SignupInput!) {
      signup(input: $input) {
        id
        email
        username
        role
        confirmedAt
      }
    }
  `
);

export const confirmEmail = req<Mutation, 'confirmEmail', { input: ConfirmEmailInput }>(
  'confirmEmail',
  gql`
    mutation confirmEmail($input: ConfirmEmailInput!) {
      confirmEmail(input: $input) {
        confirmedAt
      }
    }
  `
);

export const resendConfirmationEmail = req<Mutation, 'resendConfirmationEmail'>(
  'resendConfirmationEmail',
  gql`
    mutation {
      resendConfirmationEmail
    }
  `
);

export const sendResetPasswordEmail = req<Mutation, 'sendResetPasswordEmail', { input: SendResetPasswordEmailInput }>(
  'sendResetPasswordEmail',
  gql`
    mutation sendResetPasswordEmail($input: SendResetPasswordEmailInput!) {
      sendResetPasswordEmail(input: $input)
    }
  `
);

export const resetPassword = req<Mutation, 'resetPassword', { input: ResetPasswordInput }>(
  'resetPassword',
  gql`
    mutation resetPassword($input: ResetPasswordInput!) {
      resetPassword(input: $input)
    }
  `
);

export const notation = req<Query, 'notation', QueryNotationArgs>(
  'notation',
  gql`
    query notation($id: String!) {
      notation(id: $id) {
        id
        createdAt
        updatedAt
        songName
        artistName
        deadTimeMs
        durationMs
        private
        transcriberId
        thumbnailUrl
        videoUrl
        musicXmlUrl
        transcriber {
          username
        }
      }
    }
  `
);

export const notations = req<Query, 'notations', QueryNotationsArgs>(
  'notations',
  gql`
    query notations($first: Float, $last: Float, $after: String, $before: String, $query: String, $tagIds: [String!]) {
      notations(first: $first, last: $last, after: $after, before: $before, query: $query, tagIds: $tagIds) {
        edges {
          cursor
          node {
            id
            createdAt
            updatedAt
            songName
            artistName
            thumbnailUrl
            transcriber {
              id
              username
              role
              avatarUrl
            }
            tags {
              id
              name
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `
);

export const suggestedNotations = req<Query, 'suggestedNotations', QuerySuggestedNotationsArgs>(
  'suggestedNotations',
  gql`
    query suggestedNotations($id: String!, $limit: Int!) {
      suggestedNotations(id: $id, limit: $limit) {
        id
        createdAt
        updatedAt
        songName
        artistName
        thumbnailUrl
        transcriber {
          id
          username
          role
          avatarUrl
        }
        tags {
          id
          name
        }
      }
    }
  `
);

export const createNotation = req<Mutation, 'createNotation', { input: CreateNotationInput }>(
  'createNotation',
  gql`
    mutation createNotation($input: CreateNotationInput!) {
      createNotation(input: $input) {
        id
      }
    }
  `
);

export const tags = req<Query, 'tags'>(
  'tags',
  gql`
    query {
      tags {
        id
        name
      }
    }
  `
);
