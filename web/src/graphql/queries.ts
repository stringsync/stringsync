import { $gql } from './$gql';
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
  UserRoles,
} from './graphqlTypes';
import { t } from './t';

export const whoami = $gql
  .query('whoami')
  .setQuery({
    id: t.string,
    email: t.string,
    username: t.string,
    role: t.optional.oneOf(UserRoles)!,
    confirmedAt: t.string,
  })
  .build();

export const login = $gql
  .mutation('login')
  .setQuery({
    id: t.string,
    email: t.string,
    username: t.string,
    role: t.optional.oneOf(UserRoles)!,
    confirmedAt: t.string,
  })
  .setVariables<{ input: LoginInput }>({
    input: {
      usernameOrEmail: t.string,
      password: t.string,
    },
  })
  .build();

export const logout = $gql
  .mutation('logout')
  .setQuery(t.boolean)
  .build();

export const signup = $gql
  .mutation('signup')
  .setQuery({
    id: t.string,
    email: t.string,
    username: t.string,
    role: t.optional.oneOf(UserRoles)!,
    confirmedAt: t.string,
  })
  .setVariables<{ input: SignupInput }>({
    input: {
      email: t.string,
      password: t.string,
      username: t.string,
    },
  })
  .build();

export const confirmEmail = $gql
  .mutation('confirmEmail')
  .setQuery({
    confirmedAt: t.string,
  })
  .setVariables<{ input: ConfirmEmailInput }>({
    input: { confirmationToken: t.string },
  })
  .build();

export const resendConfirmationEmail = $gql
  .mutation('resendConfirmationEmail')
  .setQuery(t.boolean)
  .build();

export const sendResetPasswordEmail = $gql
  .mutation('sendResetPasswordEmail')
  .setQuery(t.boolean)
  .setVariables<{ input: SendResetPasswordEmailInput }>({
    input: { email: t.string },
  })
  .build();

export const resetPassword = $gql
  .mutation('resetPassword')
  .setQuery(t.boolean)
  .setVariables<{ input: ResetPasswordInput }>({
    input: { email: t.string, password: t.string, resetPasswordToken: t.string },
  })
  .build();

export const notation = $gql
  .query('notation')
  .setQuery({
    id: t.string,
    createdAt: t.string,
    updatedAt: t.string,
    songName: t.string,
    artistName: t.string,
    deadTimeMs: t.number,
    durationMs: t.number,
    private: t.boolean,
    transcriberId: t.string,
    thumbnailUrl: t.optional.string,
    videoUrl: t.optional.string,
    musicXmlUrl: t.optional.string,
    transcriber: { username: t.string },
  })
  .setVariables<QueryNotationArgs>({ id: t.string })
  .build();

export const notations = $gql
  .query('notations')
  .setQuery({
    edges: [
      {
        cursor: t.string,
        node: {
          id: t.string,
          createdAt: t.string,
          updatedAt: t.string,
          songName: t.string,
          artistName: t.string,
          thumbnailUrl: t.optional.string,
          transcriber: {
            id: t.string,
            username: t.string,
            role: t.optional.oneOf(UserRoles)!,
            avatarUrl: t.optional.string,
          },
          tags: [{ id: t.string, name: t.string }],
        },
      },
    ],
    pageInfo: {
      hasNextPage: t.boolean,
      hasPreviousPage: t.boolean,
      startCursor: t.optional.string,
      endCursor: t.optional.string,
    },
  })
  .setVariables<QueryNotationsArgs>({
    first: t.optional.number,
    last: t.optional.number,
    after: t.optional.string,
    before: t.optional.string,
    query: t.optional.string,
    tagIds: [t.string],
  })
  .build();

export const suggestedNotations = $gql
  .query('suggestedNotations')
  .setQuery([
    {
      id: t.string,
      createdAt: t.string,
      updatedAt: t.string,
      songName: t.string,
      artistName: t.string,
      thumbnailUrl: t.optional.string,
      transcriber: {
        id: t.string,
        username: t.string,
        role: t.optional.oneOf(UserRoles)!,
        avatarUrl: t.optional.string,
      },
      tags: [{ id: t.string, name: t.string }],
    },
  ])
  .setVariables<QuerySuggestedNotationsArgs>({
    id: t.string,
    limit: t.number,
  })
  .build();

export const createNotation = $gql
  .mutation('createNotation')
  .setQuery({ id: t.string })
  .setVariables<{ input: CreateNotationInput }>({
    input: {
      artistName: t.string,
      songName: t.string,
      tagIds: [t.string],
      thumbnail: t.custom<File>(),
      video: t.custom<File>(),
    },
  })
  .build();

export const tags = $gql
  .query('tags')
  .setQuery([{ id: t.string, name: t.string }])
  .build();
