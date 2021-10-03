import { $gql, t } from '../../graphql';
import { useGql, UseGqlOptions } from '../../hooks/useGql';

const RESEND_CONFIRMATION_EMAIL_GQL = $gql
  .mutation('resendConfirmationEmail')
  .setQuery(t.boolean)
  .build();

export const useResendConfirmationToken = (opts: UseGqlOptions<typeof RESEND_CONFIRMATION_EMAIL_GQL>) => {
  return useGql(RESEND_CONFIRMATION_EMAIL_GQL, opts);
};
