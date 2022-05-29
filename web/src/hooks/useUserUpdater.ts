import { UNKNOWN_ERROR_MSG } from '../errors';
import { $gql, t, UpdateUserInput, UpdateUserOutput, User, UserRole, VariablesOf } from '../graphql';
import { useGql } from './useGql';

type UserUpdater = (variables: VariablesOf<typeof UPDATE_USER_GQL>) => void;
type Loading = boolean;
type SuccessCallback = (user: UserPreview) => void;
type ErrorsCallback = (errors: string[]) => void;
type UserPreview = Pick<User, 'id' | 'username' | 'email' | 'role' | 'avatarUrl' | 'confirmedAt' | 'createdAt'>;

const UPDATE_USER_GQL = $gql
  .mutation('updateUser')
  .setQuery({
    ...t.union<UpdateUserOutput>()({
      User: {
        __typename: t.constant('User'),
        id: t.string,
        createdAt: t.string,
        email: t.string,
        role: t.optional.oneOf(UserRole)!,
        username: t.string,
        avatarUrl: t.optional.string,
        confirmedAt: t.optional.string,
      },
      ForbiddenError: {
        __typename: t.constant('ForbiddenError'),
        message: t.string,
      },
      NotFoundError: {
        __typename: t.constant('NotFoundError'),
        message: t.string,
      },
      BadRequestError: {
        __typename: t.constant('BadRequestError'),
        message: t.string,
      },
      ValidationError: {
        __typename: t.constant('ValidationError'),
        details: [t.string],
      },
      UnknownError: {
        __typename: t.constant('UnknownError'),
        message: t.string,
      },
    }),
  })
  .setVariables<{ input: Pick<UpdateUserInput, 'id' | 'role'> }>({
    input: { id: t.string, role: t.optional.oneOf(UserRole)! },
  })
  .build();

export const useUserUpdater = (onSuccess: SuccessCallback, onErrors: ErrorsCallback): [Loading, UserUpdater] => {
  const { execute, loading } = useGql(UPDATE_USER_GQL, {
    onData: (data) => {
      switch (data.updateUser?.__typename) {
        case 'User':
          onSuccess(data.updateUser);
          break;
        case 'ValidationError':
          onErrors(data.updateUser.details);
          break;
        default:
          onErrors([data.updateUser?.message || UNKNOWN_ERROR_MSG]);
      }
    },
  });
  return [loading, execute];
};
