import { $gql, ResetPasswordInput, t } from '../../graphql';
import { useGql, UseGqlOptions } from '../../hooks/useGql';

const RESET_PASSWORD_GQL = $gql
  .mutation('resetPassword')
  .setQuery(t.boolean)
  .setVariables<{ input: ResetPasswordInput }>({
    input: { email: t.string, password: t.string, resetPasswordToken: t.string },
  })
  .build();

export const useResetPassword = (opts: UseGqlOptions<typeof RESET_PASSWORD_GQL>) => {
  return useGql(RESET_PASSWORD_GQL, opts);
};
