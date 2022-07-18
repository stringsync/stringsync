import { $gql, SendResetPasswordEmailInput, t } from '../lib/graphql';
import { useGql } from './useGql';

const SEND_RESET_PASSWORD_EMAIL_GQL = $gql
  .mutation('sendResetPasswordEmail')
  .setQuery({ at: t.string })
  .setVariables<{ input: SendResetPasswordEmailInput }>({
    input: { email: t.string },
  })
  .build();

export const useSendResetPasswordEmail = () => useGql(SEND_RESET_PASSWORD_EMAIL_GQL);
