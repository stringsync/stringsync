import { PromiseStatus } from '../util/types';
import { useFetch } from './useFetch';

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
export const useImmediateFetch = (
  input: RequestInfo,
  init?: RequestInit
): [Response | null, Error | null, FetchStatus, AbortController] => {
  const [fetch, fetchPromise, abortController] = useFetch(input, init);

  const { result, error, status } = fetchPromise;

  return [result ?? null, error ?? null, toFetchStatus(status), abortController];
};
