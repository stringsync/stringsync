import { $gql, ConfirmEmailInput, ConfirmEmailOutput, t } from '../lib/graphql';
import { useGql, UseGqlOptions } from './useGql';

const CONFIRM_EMAIL_GQL = $gql
  .mutation('confirmEmail')
  .setQuery({
    ...t.union<ConfirmEmailOutput>()({
      EmailConfirmation: {
        __typename: t.constant('EmailConfirmation'),
        confirmedAt: t.string,
      },
      NotFoundError: {
        __typename: t.constant('NotFoundError'),
        message: t.string,
      },
      BadRequestError: {
        __typename: t.constant('BadRequestError'),
        message: t.string,
      },
      ForbiddenError: {
        __typename: t.constant('ForbiddenError'),
        message: t.string,
      },
      UnknownError: {
        __typename: t.constant('UnknownError'),
        message: t.string,
      },
    }),
  })
  .setVariables<{ input: ConfirmEmailInput }>({
    input: { confirmationToken: t.string },
  })
  .build();

export const useConfirmEmail = (opts: UseGqlOptions<typeof CONFIRM_EMAIL_GQL>) => {
  return useGql(CONFIRM_EMAIL_GQL, opts);
};
