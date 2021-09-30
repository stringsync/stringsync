import { useCallback, useState } from 'react';
import { useAsyncCallback } from './useAsyncCallback';

export const useFetch = () => {
  const [abortController] = useState(() => new AbortController());

  const onCleanup = useCallback(
    (done: boolean) => {
      if (!done) {
        abortController.abort();
      }
    },
    [abortController]
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

  const [managedFetch, fetchPromise] = useAsyncCallback(wrappedFetch, onCleanup);

  return [managedFetch, fetchPromise, abortController];
};
