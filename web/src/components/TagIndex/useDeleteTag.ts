import { useCallback } from 'react';
import { $gql, t } from '../../graphql';
import { useGql } from '../../hooks/useGql';

type DeleteTag = (id: string) => void;
type Loading = boolean;
type SuccessCallback = () => void;
type ErrorsCallback = (errors: string[]) => void;

const DELETE_TAG_GQL = $gql
  .mutation('deleteTag')
  .setQuery(t.boolean)
  .setVariables<{ id: string }>({ id: t.string })
  .build();

export const useDeleteTag = (onSuccess: SuccessCallback, onErrors: ErrorsCallback): [DeleteTag, Loading] => {
  const { execute, loading } = useGql(DELETE_TAG_GQL, {
    onData: () => {
      onSuccess();
    },
    onErrors,
  });

  const deleteTag = useCallback(
    (id: string) => {
      execute({ id });
    },
    [execute]
  );

  return [deleteTag, loading];
};
