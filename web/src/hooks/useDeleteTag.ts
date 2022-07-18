import { useCallback } from 'react';
import { UNKNOWN_ERROR_MSG } from '../lib/errors';
import { $gql, DeleteTagOutput, t } from '../lib/graphql';
import { GqlStatus, useGql } from './useGql';
import { useGqlResHandler } from './useGqlResHandler';

type DeleteTag = (id: string) => void;
type SuccessCallback = () => void;
type ErrorsCallback = (errors: string[]) => void;

const DELETE_TAG_GQL = $gql
  .mutation('deleteTag')
  .setQuery({
    ...t.union<DeleteTagOutput>()({
      Processed: {
        __typename: t.constant('Processed'),
        at: t.string,
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
  .setVariables<{ id: string }>({ id: t.string })
  .build();

export const useDeleteTag = (
  onSuccess: SuccessCallback,
  onErrors: ErrorsCallback
): [deleteTag: DeleteTag, loading: boolean] => {
  const [execute, res] = useGql(DELETE_TAG_GQL);
  const loading = res.status === GqlStatus.Pending;
  useGqlResHandler.onSuccess(res, ({ data }) => {
    switch (data.deleteTag?.__typename) {
      case 'Processed':
        onSuccess();
        break;
      default:
        onErrors([data.deleteTag?.message || UNKNOWN_ERROR_MSG]);
    }
  });

  const deleteTag = useCallback(
    (id: string) => {
      execute({ id });
    },
    [execute]
  );

  return [deleteTag, loading];
};
