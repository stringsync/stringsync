import { useCallback, useMemo } from 'react';
import { $gql, Any$gql, GqlResponseOf, GRAPHQL_URI, VariablesOf } from '../graphql';
import { PromiseResolver } from '../util/types';
import { useFetch } from './useFetch';
import { useMemoCmp } from './useMemoCmp';

export const useGql = <G extends Any$gql>(gql: G, resolver: PromiseResolver<GqlResponseOf<G>, void>) => {
  resolver = useMemoCmp(resolver);

  const fetchResolver = useMemo(() => {
    return {
      ...resolver,
      then: async (result: Response) => {
        const res = await $gql.toGqlResponse<G>(result);
        resolver.then && (await resolver.then(res));
        return res;
      },
    };
  }, [resolver]);

  const [fetch, fetchPromise] = useFetch(fetchResolver);

  const fetchGql = useCallback(
    (variables: VariablesOf<G>) => {
      fetch(GRAPHQL_URI, gql.toRequestInit(variables));
    },
    [gql, fetch]
  );

  return [fetchGql, fetchPromise] as const;
};
