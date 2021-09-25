import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePromise } from './usePromise';

export const useFetch = (input: RequestInfo, init?: RequestInit) => {
  const [abortController] = useState(() => new AbortController());
  const fetchArgs = useMemo<[RequestInfo, RequestInit]>(() => [input, { ...init, signal: abortController.signal }], [
    input,
    init,
    abortController,
  ]);

  const abort = useCallback(() => {
    abortController.abort();
  }, [abortController]);

  useEffect(() => {
    if (init && init.signal) {
      throw new Error(`cannot specify init.signal, use the abort callback instead`);
    }
  }, [init]);

  const fetchState = usePromise(fetch, fetchArgs, abort);

  return { ...fetchState, abort };
};
