import { gql } from './gql';
import { mutation, query } from './graphql';
import {
  ConfirmEmailInput,
  CreateNotationInput,
  LoginInput,
  QueryNotationArgs,
  QueryNotationsArgs,
  QuerySuggestedNotationsArgs,
  ResetPasswordInput,
  SendResetPasswordEmailInput,
  SignupInput,
} from './graphqlTypes';

export const whoami = async () => {
  return await query<'whoami'>(gql`
    query {
      whoami {
        id
        email
        username
        role
        confirmedAt
      }
    }
  `);
};

export const login = async (input: LoginInput) => {
  return await mutation<'login', { input: LoginInput }>(
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
    `,
    { input }
  );
};

export const logout = async () => {
  return await mutation<'logout'>(gql`
    mutation logout {
      logout
    }
  `);
};

export const signup = async (input: SignupInput) => {
  return await mutation<'signup', { input: SignupInput }>(
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
    `,
    { input }
  );
};

export const confirmEmail = async (input: ConfirmEmailInput) => {
  return await mutation<'confirmEmail', { input: ConfirmEmailInput }>(
    gql`
      mutation confirmEmail($input: ConfirmEmailInput!) {
        confirmEmail(input: $input) {
          confirmedAt
        }
      }
    `,
    { input }
  );
};

export const resendConfirmationEmail = async () => {
  return await mutation<'resendConfirmationEmail'>(
    gql`
      mutation {
        resendConfirmationEmail
      }
    `
  );
};

export const sendResetPasswordEmail = async (input: SendResetPasswordEmailInput) => {
  return await mutation<'sendResetPasswordEmail', { input: SendResetPasswordEmailInput }>(
    gql`
      mutation sendResetPasswordEmail($input: SendResetPasswordEmailInput!) {
        sendResetPasswordEmail(input: $input)
      }
    `,
    { input }
  );
};

export const resetPassword = async (input: ResetPasswordInput) => {
  return await mutation<'resetPassword', { input: ResetPasswordInput }>(
    gql`
      mutation resetPassword($input: ResetPasswordInput!) {
        resetPassword(input: $input)
      }
    `,
    { input }
  );
};

export const notation = async (args: QueryNotationArgs) => {
  return await query<'notation', QueryNotationArgs>(
    gql`
      query notation($id: String!) {
        notation(id: $id) {
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
        }
      }
    `,
    args
  );
};

export const notations = async (args: QueryNotationsArgs) => {
  return await query<'notations', QueryNotationsArgs>(
    gql`
      query notations(
        $first: Float
        $last: Float
        $after: String
        $before: String
        $query: String
        $tagIds: [String!]
      ) {
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
    `,
    args
  );
};

export const suggestedNotations = async (args: QuerySuggestedNotationsArgs) => {
  return await query<'suggestedNotations', QuerySuggestedNotationsArgs>(
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
    `,
    args
  );
};

export const createNotation = async (input: CreateNotationInput) => {
  return await mutation<'createNotation', { input: CreateNotationInput }>(
    gql`
      mutation createNotation($input: CreateNotationInput!) {
        createNotation(input: $input) {
          id
        }
      }
    `,
    { input }
  );
};

export const tags = async () => {
  return await query<'tags'>(gql`
    query {
      tags {
        id
        name
      }
    }
  `);
};
