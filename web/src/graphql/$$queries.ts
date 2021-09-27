import { types } from 'typed-graphqlify';
import { LoginInput } from '.';
import { Gql } from './$gql';
import {
  ConfirmEmailInput,
  CreateNotationInput,
  QueryNotationArgs,
  QueryNotationsArgs,
  QuerySuggestedNotationsArgs,
  ResetPasswordInput,
  SendResetPasswordEmailInput,
  SignupInput,
  UserRoles,
} from './graphqlTypes';

export const whoami = Gql.query('whoami')
  .setQuery({
    id: types.string,
    email: types.string,
    username: types.string,
    role: types.optional.oneOf(UserRoles)!,
    confirmedAt: types.string,
  })
  .build();

export const login = Gql.mutation('login')
  .setQuery({
    id: types.string,
    email: types.string,
    username: types.string,
    role: types.optional.oneOf(UserRoles)!,
    confirmedAt: types.string,
  })
  .setVariables<{ input: LoginInput }>({
    input: {
      usernameOrEmail: types.string,
      password: types.string,
    },
  })
  .build();

export const logout = Gql.mutation('logout')
  .setQuery(types.boolean)
  .build();

export const signup = Gql.mutation('signup')
  .setQuery({
    id: types.string,
    email: types.string,
    username: types.string,
    role: types.optional.oneOf(UserRoles)!,
    confirmedAt: types.string,
  })
  .setVariables<{ input: SignupInput }>({
    input: {
      email: types.string,
      password: types.string,
      username: types.string,
    },
  })
  .build();

export const confirmEmail = Gql.mutation('confirmEmail')
  .setQuery({
    confirmedAt: types.string,
  })
  .setVariables<{ input: ConfirmEmailInput }>({
    input: { confirmationToken: types.string },
  })
  .build();

export const resendConfirmationEmail = Gql.mutation('resendConfirmationEmail')
  .setQuery(types.boolean)
  .build();

export const sendResetPasswordEmail = Gql.mutation('sendResetPasswordEmail')
  .setQuery(types.boolean)
  .setVariables<{ input: SendResetPasswordEmailInput }>({
    input: { email: types.string },
  })
  .build();

export const resetPassword = Gql.mutation('resetPassword')
  .setQuery(types.boolean)
  .setVariables<{ input: ResetPasswordInput }>({
    input: { email: types.string, password: types.string, resetPasswordToken: types.string },
  })
  .build();

export const notation = Gql.query('notation')
  .setQuery({
    id: types.string,
    createdAt: types.string,
    updatedAt: types.string,
    songName: types.string,
    artistName: types.string,
    deadTimeMs: types.number,
    durationMs: types.number,
    private: types.boolean,
    transcriberId: types.string,
    thumbnailUrl: types.optional.string,
    videoUrl: types.optional.string,
    musicXmlUrl: types.optional.string,
    transcriber: { username: types.string },
  })
  .setVariables<QueryNotationArgs>({ id: types.string })
  .build();

export const notations = Gql.query('notations')
  .setQuery({
    edges: [
      {
        cursor: types.string,
        node: {
          id: types.string,
          createdAt: types.string,
          updatedAt: types.string,
          songName: types.string,
          artistName: types.string,
          thumbnailUrl: types.optional.string,
          transcriber: {
            id: types.string,
            username: types.string,
            role: types.optional.oneOf(UserRoles)!,
            avatarUrl: types.optional.string,
          },
          tags: [{ id: types.string, name: types.string }],
        },
      },
    ],
    pageInfo: {
      hasNextPage: types.boolean,
      hasPreviousPage: types.boolean,
      startCursor: types.optional.string,
      endCursor: types.optional.string,
    },
  })
  .setVariables<QueryNotationsArgs>({
    first: types.optional.number,
    last: types.optional.number,
    after: types.optional.string,
    before: types.optional.string,
    query: types.optional.string,
    tagIds: [types.string],
  })
  .build();

export const suggestedNotations = Gql.query('suggestedNotations')
  .setQuery([
    {
      id: types.string,
      createdAt: types.string,
      updatedAt: types.string,
      songName: types.string,
      artistName: types.string,
      thumbnailUrl: types.optional.string,
      transcriber: {
        id: types.string,
        username: types.string,
        role: types.optional.oneOf(UserRoles)!,
        avatarUrl: types.optional.string,
      },
      tags: [{ id: types.string, name: types.string }],
    },
  ])
  .setVariables<QuerySuggestedNotationsArgs>({
    id: types.string,
    limit: types.number,
  })
  .build();

export const createNotation = Gql.mutation('createNotation')
  .setQuery({ id: types.string })
  .setVariables<{ input: CreateNotationInput }>({
    input: {
      artistName: types.string,
      songName: types.string,
      tagIds: [types.string],
      thumbnail: types.custom<File>(),
      video: types.custom<File>(),
    },
  })
  .build();

export const tags = Gql.query('tags')
  .setQuery([{ id: types.string, name: types.string }])
  .build();
