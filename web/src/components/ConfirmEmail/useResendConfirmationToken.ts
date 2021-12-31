import { $gql, ResendConfirmationEmailOutput, t } from '../../graphql';
import { useGql, UseGqlOptions } from '../../hooks/useGql';

const RESEND_CONFIRMATION_EMAIL_GQL = $gql
  .mutation('resendConfirmationEmail')
  .setQuery({
    ...t.union<ResendConfirmationEmailOutput>()({
      Processed: {
        __typename: t.constant('Processed'),
        at: t.string,
      },
      ForbiddenError: {
        __typename: t.constant('ForbiddenError'),
        message: t.string,
      },
    }),
  })
  .build();

export const useResendConfirmationToken = (opts: UseGqlOptions<typeof RESEND_CONFIRMATION_EMAIL_GQL>) => {
  return useGql(RESEND_CONFIRMATION_EMAIL_GQL, opts);
};
