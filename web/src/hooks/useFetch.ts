import { useCallback, useMemo, useState } from 'react';
import { PromiseResolver } from '../util/types';
import { useAsync } from './useAsync';
import { useMemoCmp } from './useMemoCmp';

export const useFetch = <R = Response>(resolver: PromiseResolver<Response, R>) => {
  resolver = useMemoCmp(resolver);
  const [abortController] = useState(() => new AbortController());

  const fetchResolver = useMemo(
    () => ({
      ...resolver,
      cancel: () => {
        if (resolver.cancel) {
          resolver.cancel();
        }
        abortController.abort();
      },
    }),
    [resolver, abortController]
  );

  // Creates a fetch that always has an abort controller tied to it.
  const wrappedFetch = useCallback(
    async (input: RequestInfo, init?: RequestInit) => {
      if (init && init.signal) {
        throw new Error(`cannot specify init.signal, use the abort controller instead`);
      }
      return await fetch(input, { ...init, signal: abortController.signal });
    },
    [abortController]
  );

  const [invokeFetch, promise] = useAsync(wrappedFetch, fetchResolver);

  return [invokeFetch, promise, abortController] as const;
};
