import { first } from 'lodash';
import { useCallback } from 'react';
import { $gql, QuerySuggestedNotationsArgs, t } from '../graphql';
import { UNKNOWN_ERROR_MSG } from '../lib/errors';
import { useGql } from './useGql';

type SuccessCallback = (notationId: string) => void;
type ErrorsCallback = (errors: string[]) => void;
type RandomNotationIdGetter = () => void;

const RANDOM_NOTATION_ID_GQL = $gql
  .query('suggestedNotations')
  .setQuery([{ id: t.string }])
  .setVariables<QuerySuggestedNotationsArgs>({ limit: t.number })
  .build();

export const useRandomNotationIdGetter = (
  onSuccess: SuccessCallback,
  onErrors: ErrorsCallback
): [boolean, RandomNotationIdGetter] => {
  const { execute, loading } = useGql(RANDOM_NOTATION_ID_GQL, {
    onData: (data) => {
      const id = first(data.suggestedNotations.map((notation) => notation.id));
      if (id) {
        onSuccess(id);
      } else {
        onErrors([UNKNOWN_ERROR_MSG]);
      }
    },
    onErrors: (errors) => {
      onErrors(errors);
    },
  });
  const getRandomNotationId = useCallback(() => {
    execute({ limit: 1 });
  }, [execute]);
  return [loading, getRandomNotationId];
};
