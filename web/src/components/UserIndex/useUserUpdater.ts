import { $gql, t, UpdateUserInput, UserRole, VariablesOf } from '../../graphql';
import { useGql } from '../../hooks/useGql';
import { UserPreview } from './types';

type UserUpdater = (variables: VariablesOf<typeof UPDATE_USER_GQL>) => void;
type Loading = boolean;
type SuccessCallback = (user: UserPreview) => void;
type ErrorsCallback = (errors: string[]) => void;

const UPDATE_USER_GQL = $gql
  .mutation('updateUser')
  .setQuery<UserPreview>({
    id: t.string,
    createdAt: t.string,
    email: t.string,
    role: t.optional.oneOf(UserRole)!,
    username: t.string,
    avatarUrl: t.optional.string,
    confirmedAt: t.optional.string,
  })
  .setVariables<{ input: Pick<UpdateUserInput, 'id' | 'role'> }>({
    input: { id: t.string, role: t.optional.oneOf(UserRole)! },
  })
  .build();

export const useUserUpdater = (onSuccess: SuccessCallback, onErrors: ErrorsCallback): [Loading, UserUpdater] => {
  const { execute, loading } = useGql(UPDATE_USER_GQL, {
    onData: (data) => {
      if (!data.updateUser) {
        onErrors(['something went wrong']);
        return;
      }
      onSuccess(data.updateUser);
    },
    onErrors,
  });
  return [loading, execute];
};
