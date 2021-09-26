import { useCallback, useEffect, useMemo, useState } from 'react';
import { PromiseStatus, usePromise } from './usePromise';

export enum FetchStatus {
  Pending,
  Rejected,
  Resolved,
}

const toFetchStatus = (promiseStatus: PromiseStatus) => {
  switch (promiseStatus) {
    case PromiseStatus.Pending:
      return FetchStatus.Pending;
    case PromiseStatus.Rejected:
      return FetchStatus.Rejected;
    case PromiseStatus.Resolved:
      return FetchStatus.Resolved;
    default:
      throw new Error(`unhandled promise status: ${promiseStatus}`);
  }
};

/**
 * Makes a request using the fetch parameters. The main benefit of using this hook is
 * that it will abort in-flight requests if the parameters change.
 */
export const useFetch = (
  input: RequestInfo,
  init?: RequestInit
): [Response | null, Error | null, FetchStatus, AbortController] => {
  const [abortController] = useState(() => new AbortController());
  const fetchArgs = useMemo<[RequestInfo, RequestInit]>(() => [input, { ...init, signal: abortController.signal }], [
    input,
    init,
    abortController,
  ]);

  const onCleanup = useCallback(
    (done: boolean) => {
      if (!done) {
        abortController.abort();
      }
    },
    [abortController]
  );

  useEffect(() => {
    if (init && init.signal) {
      throw new Error(`cannot specify init.signal, use the abort controller instead`);
    }
  }, [init]);

  const [result, error, promiseStatus] = usePromise(fetch, fetchArgs, onCleanup);

  return [result ?? null, error ?? null, toFetchStatus(promiseStatus), abortController];
};
