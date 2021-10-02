import { useState } from 'react';
import { useAsyncCallback, UseAsyncCallbackOptions } from 'react-async-hook';
import { Any$gql, GqlResponseOf, VariablesOf } from '../graphql';

export type UseGqlOptions<G extends Any$gql> = Partial<
  UseAsyncCallbackOptions<GqlResponseOf<G>> & {
    beforeLoading: () => void;
  }
>;

export const useGql = <G extends Any$gql>(gql: G, opts?: UseGqlOptions<G>) => {
  const [abortController] = useState(() => new AbortController());

  return useAsyncCallback(async (variables: VariablesOf<G>) => {
    abortController.abort();
    if (opts?.beforeLoading) {
      opts.beforeLoading();
    }
    const res = await gql.fetch(variables, abortController.signal);
    return res;
  }, opts);
};
