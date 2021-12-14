import { $gql, ConfirmEmailInput, ConfirmEmailOutput, t } from '../../graphql';
import { useGql, UseGqlOptions } from '../../hooks/useGql';

const CONFIRM_EMAIL_GQL = $gql
  .mutation('confirmEmail')
  .setQuery({
    ...t.union<ConfirmEmailOutput>()({
      EmailConfirmation: {
        confirmedAt: t.string,
      },
      NotFoundError: {
        message: t.string,
      },
      ValidationError: {
        details: [t.string],
      },
      ForbiddenError: {
        message: t.string,
      },
      UnknownError: {
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
