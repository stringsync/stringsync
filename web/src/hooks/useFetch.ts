import { useCallback, useEffect, useMemo, useState } from 'react';
import { PromiseStatus, usePromise } from './usePromise';

export enum FetchStatus {
  Pending,
  Rejected,
  Resolved,
}

export type FetchState = ReturnType<typeof useFetch>;

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

export const useFetch = (input: RequestInfo, init?: RequestInit) => {
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
      throw new Error(`cannot specify init.signal, use the abort callback instead`);
    }
  }, [init]);

  const { result, status, error } = usePromise(fetch, fetchArgs, onCleanup);

  return useMemo(() => ({ response: result, status: toFetchStatus(status), error, abort: abortController.abort }), [
    result,
    status,
    error,
    abortController.abort,
  ]);
};
