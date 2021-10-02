import { $gql, SendResetPasswordEmailInput, t } from '../../graphql';
import { useGql, UseGqlOptions } from '../../hooks/useGql';

const SEND_RESET_PASSWORD_EMAIL_GQL = $gql
  .mutation('sendResetPasswordEmail')
  .setQuery(t.boolean)
  .setVariables<{ input: SendResetPasswordEmailInput }>({
    input: { email: t.string },
  })
  .build();

export const useSendResetPasswordEmail = (opts?: UseGqlOptions<typeof SEND_RESET_PASSWORD_EMAIL_GQL>) => {
  const { execute } = useGql(SEND_RESET_PASSWORD_EMAIL_GQL, opts);
  return execute;
};
