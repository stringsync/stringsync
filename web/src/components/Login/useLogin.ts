import { $gql, LoginInput, t, UserRoles } from '../../graphql';
import { useAsync } from '../../hooks/useAsync';

const LOGIN_GQL = $gql
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

export const useLogin = () => {
  return useAsync(LOGIN_GQL.fetch);
};
