import { $gql, LoginInput, LoginOutput, LogoutOutput, SignupInput, SignupOutput, t } from '../../graphql';

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
    ...t.union<LoginOutput>()({
      User: {
        id: t.string,
        email: t.string,
        username: t.string,
        role: t.optional.oneOf(UserRoles)!,
        confirmedAt: t.string,
      },
      ForbiddenError: {
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
        at: t.string,
      },
      ForbiddenError: {
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
        id: t.string,
        email: t.string,
        username: t.string,
        role: t.optional.oneOf(UserRoles)!,
        confirmedAt: t.string,
      },
      ForbiddenError: {
        message: t.string,
      },
      ValidationError: {
        details: [t.string],
      },
      UnknownError: {
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
function UserRoles(UserRoles: any): any {
  throw new Error('Function not implemented.');
}
