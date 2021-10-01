import { $gql, SendResetPasswordEmailInput, t } from '../../graphql';
import { useAsync } from '../../hooks/useAsync';

const SEND_RESET_PASSWORD_EMAIL_GQL = $gql
  .mutation('sendResetPasswordEmail')
  .setQuery(t.boolean)
  .setVariables<{ input: SendResetPasswordEmailInput }>({
    input: { email: t.string },
  })
  .build();

export const useSendResetPasswordEmail = () => {
  return useAsync(SEND_RESET_PASSWORD_EMAIL_GQL.fetch);
};
