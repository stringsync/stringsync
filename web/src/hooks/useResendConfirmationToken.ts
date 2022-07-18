import { $gql, ResendConfirmationEmailOutput, t } from '../lib/graphql';
import { useGql } from './useGql';

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

export const useResendConfirmationToken = () => useGql(RESEND_CONFIRMATION_EMAIL_GQL);
