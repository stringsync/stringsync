import { useRef } from 'react';
import { useAsyncCallback, UseAsyncCallbackOptions } from 'react-async-hook';
import { Any$gql, GqlResponseOf, VariablesOf } from '../graphql';

export type UseGqlOptions<G extends Any$gql> = Partial<
  UseAsyncCallbackOptions<GqlResponseOf<G>> & {
    beforeLoading: () => void;
  }
>;

export const useGql = <G extends Any$gql>(gql: G, opts?: UseGqlOptions<G>) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  return useAsyncCallback(async (variables: VariablesOf<G>) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    if (opts?.beforeLoading) {
      opts.beforeLoading();
    }

    try {
      return await gql.fetch(variables, abortController.signal);
    } finally {
      abortControllerRef.current = null;
    }
  }, opts);
};
