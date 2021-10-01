import { $gql, LoginInput, t, UserRoles } from '../../graphql';

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
