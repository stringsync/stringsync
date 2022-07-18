import { first } from 'lodash';
import { useCallback } from 'react';
import { UNKNOWN_ERROR_MSG } from '../lib/errors';
import { $gql, QuerySuggestedNotationsArgs, t } from '../lib/graphql';
import { GqlStatus, useGql } from './useGql';
import { useGqlResHandler } from './useGqlResHandler';

type SuccessCallback = (notationId: string) => void;
type ErrorsCallback = (errors: string[]) => void;
type GetRandomNotationId = () => void;

const RANDOM_NOTATION_ID_GQL = $gql
  .query('suggestedNotations')
  .setQuery([{ id: t.string }])
  .setVariables<QuerySuggestedNotationsArgs>({ limit: t.number })
  .build();

export const useRandomNotationIdGetter = (
  onSuccess: SuccessCallback,
  onErrors: ErrorsCallback
): [getRandomNotationId: GetRandomNotationId, loading: boolean] => {
  const [execute, res] = useGql(RANDOM_NOTATION_ID_GQL);
  const loading = res.status === GqlStatus.Pending;
  useGqlResHandler.onSuccess(res, ({ data }) => {
    const id = first(data.suggestedNotations.map((notation) => notation.id));
    if (id) {
      onSuccess(id);
    } else {
      onErrors([UNKNOWN_ERROR_MSG]);
    }
  });
  useGqlResHandler.onErrors(res, ({ errors }) => {
    onErrors(errors);
  });

  const getRandomNotationId = useCallback(() => {
    execute({ limit: 1 });
  }, [execute]);

  return [getRandomNotationId, loading];
};
