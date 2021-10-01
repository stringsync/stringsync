import { $gql, SignupInput, t, UserRoles } from '../../graphql';
import { useAsync } from '../../hooks/useAsync';

const SIGNUP_GQL = $gql
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

export const useSignup = () => {
  return useAsync(SIGNUP_GQL.fetch);
};
