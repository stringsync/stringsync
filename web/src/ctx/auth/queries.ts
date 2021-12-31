import { $gql, LoginInput, LoginOutput, LogoutOutput, SignupInput, SignupOutput, t, UserRole } from '../../graphql';

export const whoami = $gql
  .query('whoami')
  .setQuery({
    id: t.string,
    email: t.string,
    username: t.string,
    role: t.optional.oneOf(UserRole)!,
    confirmedAt: t.string,
  })
  .build();

export const login = $gql
  .mutation('login')
  .setQuery({
    ...t.union<LoginOutput>()({
      User: {
        __typename: t.constant('User'),
        id: t.string,
        email: t.string,
        username: t.string,
        role: t.optional.oneOf(UserRole)!,
        confirmedAt: t.string,
      },
      ForbiddenError: {
        __typename: t.constant('ForbiddenError'),
        message: t.string,
      },
    }),
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
  .setQuery({
    ...t.union<LogoutOutput>()({
      Processed: {
        __typename: t.constant('Processed'),
        at: t.string,
      },
      ForbiddenError: {
        __typename: t.constant('ForbiddenError'),
        message: t.string,
      },
    }),
  })
  .build();

export const signup = $gql
  .mutation('signup')
  .setQuery({
    ...t.union<SignupOutput>()({
      User: {
        __typename: t.constant('User'),
        id: t.string,
        email: t.string,
        username: t.string,
        role: t.optional.oneOf(UserRole)!,
        confirmedAt: t.string,
      },
      ForbiddenError: {
        __typename: t.constant('ForbiddenError'),
        message: t.string,
      },
      ValidationError: {
        __typename: t.constant('ValidationError'),
        details: [t.string],
      },
      UnknownError: {
        __typename: t.constant('UnknownError'),
        message: t.string,
      },
    }),
  })
  .setVariables<{ input: SignupInput }>({
    input: {
      email: t.string,
      password: t.string,
      username: t.string,
    },
  })
  .build();
