import { useCallback } from 'react';
import { UNKNOWN_ERROR_MSG } from '../../errors';
import { $gql, DeleteTagOutput, t } from '../../graphql';
import { useGql } from '../../hooks/useGql';

type DeleteTag = (id: string) => void;
type Loading = boolean;
type SuccessCallback = () => void;
type ErrorsCallback = (errors: string[]) => void;

const DELETE_TAG_GQL = $gql
  .mutation('deleteTag')
  .setQuery({
    ...t.union<DeleteTagOutput>()({
      Processed: {
        at: t.string,
      },
      ForbiddenError: {
        message: t.string,
      },
      UnknownError: {
        message: t.string,
      },
    }),
  })
  .setVariables<{ id: string }>({ id: t.string })
  .build();

export const useDeleteTag = (onSuccess: SuccessCallback, onErrors: ErrorsCallback): [DeleteTag, Loading] => {
  const { execute, loading } = useGql(DELETE_TAG_GQL, {
    onData: (data) => {
      switch (data.deleteTag?.__typename) {
        case 'Processed':
          onSuccess();
          break;
        default:
          onErrors([data.deleteTag?.message || UNKNOWN_ERROR_MSG]);
      }
    },
  });

  const deleteTag = useCallback(
    (id: string) => {
      execute({ id });
    },
    [execute]
  );

  return [deleteTag, loading];
};
