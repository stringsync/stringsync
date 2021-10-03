import { $gql, ConfirmEmailInput, t } from '../../graphql';
import { useGql, UseGqlOptions } from '../../hooks/useGql';

const CONFIRM_EMAIL_GQL = $gql
  .mutation('confirmEmail')
  .setQuery({
    confirmedAt: t.string,
  })
  .setVariables<{ input: ConfirmEmailInput }>({
    input: { confirmationToken: t.string },
  })
  .build();

export const useConfirmEmail = (opts: UseGqlOptions<typeof CONFIRM_EMAIL_GQL>) => {
  return useGql(CONFIRM_EMAIL_GQL, opts);
};
