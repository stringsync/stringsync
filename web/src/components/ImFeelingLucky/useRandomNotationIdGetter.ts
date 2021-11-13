import { first } from 'lodash';
import { useCallback, useState } from 'react';
import { $gql, QuerySuggestedNotationsArgs, t } from '../../graphql';
import { useGql } from '../../hooks/useGql';

type RandomNotationIdGetter = () => void;

const RANDOM_NOTATION_ID_GQL = $gql
  .query('suggestedNotations')
  .setQuery([{ id: t.string }])
  .setVariables<QuerySuggestedNotationsArgs>({ limit: t.number })
  .build();

export const useRandomNotationIdGetter = (): [string | null, boolean, string[], RandomNotationIdGetter] => {
  const [notationId, setNotationId] = useState<null | string>(null);
  const [errors, setErrors] = useState(new Array<string>());
  const { execute, loading } = useGql(RANDOM_NOTATION_ID_GQL, {
    onData: (data) => {
      const ids = data.suggestedNotations.map((notation) => notation.id);
      if (ids.length > 0) {
        setNotationId(first(ids)!);
      } else {
        setErrors(['no suggestions found']);
      }
    },
    onErrors: (errors) => {
      setErrors(errors);
    },
  });
  const getRandomNotationId = useCallback(() => {
    execute({ limit: 1 });
  }, [execute]);
  return [notationId, loading, errors, getRandomNotationId];
};
