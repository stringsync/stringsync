import { $gql, DataOf, SignupInput, t, UserRoles } from '../graphql';

export type AuthUser = DataOf<typeof SIGNUP_GQL>;

const SIGNUP_GQL = $gql
  .mutation('signup')
  .setQuery({
    id: t.string,
    email: t.string,
    username: t.string,
    role: t.optional.oneOf(UserRoles)!,
    confirmedAt: t.string,
  })
  .setVariables<{ input: SignupInput }>({ input: { email: t.string, username: t.string, password: t.string } })
  .build();

export const useSignup = (input: SignupInput | null) => {};
