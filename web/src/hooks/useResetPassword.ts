import { $gql, ResetPasswordInput, ResetPasswordOutput, t } from '../lib/graphql';
import { useGql } from './useGql';

const RESET_PASSWORD_GQL = $gql
  .mutation('resetPassword')
  .setQuery({
    ...t.union<ResetPasswordOutput>()({
      Processed: {
        __typename: t.constant('Processed'),
        at: t.string,
      },
      BadRequestError: {
        __typename: t.constant('BadRequestError'),
        message: t.string,
      },
      UnknownError: {
        __typename: t.constant('UnknownError'),
        message: t.string,
      },
    }),
  })
  .setVariables<{ input: ResetPasswordInput }>({
    input: { email: t.string, password: t.string, resetPasswordToken: t.string },
  })
  .build();

export const useResetPassword = () => useGql(RESET_PASSWORD_GQL);
