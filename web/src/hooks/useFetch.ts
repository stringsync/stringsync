import { Reducer, useCallback, useEffect, useReducer, useState } from 'react';

export enum FetchStatus {
  Idle,
  Pending,
  Resolved,
  Rejected,
}

export type FetchState = {
  status: FetchStatus;
  response: Response | undefined;
  error: Error | undefined;
};

enum ActionType {
  Reset,
  Pending,
  Resolved,
  Rejected,
}

type Action =
  | { type: ActionType.Reset }
  | { type: ActionType.Pending }
  | { type: ActionType.Resolved; response: Response }
  | { type: ActionType.Rejected; error: Error };

const INITIAL_STATE: FetchState = Object.freeze({
  status: FetchStatus.Idle,
  response: undefined,
  error: undefined,
});

const fetchReducer: Reducer<FetchState, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.Reset:
      return { ...INITIAL_STATE };
    case ActionType.Pending:
      return { status: FetchStatus.Pending, response: undefined, error: undefined };
    case ActionType.Resolved:
      return { status: FetchStatus.Resolved, response: action.response, error: undefined };
    case ActionType.Rejected:
      return { status: FetchStatus.Rejected, response: undefined, error: action.error };
    default:
      return state;
  }
};

const reset = (): Action => ({ type: ActionType.Reset });
const pending = (): Action => ({ type: ActionType.Pending });
const resolve = (response: Response): Action => ({ type: ActionType.Resolved, response });
const reject = (error: Error): Action => ({ type: ActionType.Rejected, error });

export const useFetch = (shouldFetch: boolean, input: RequestInfo, init?: RequestInit) => {
  const [state, dispatch] = useReducer(fetchReducer, INITIAL_STATE);
  const [abortController] = useState(() => new AbortController());

  const abort = useCallback(() => {
    abortController.abort();
  }, [abortController]);

  useEffect(() => {
    if (init && init.signal) {
      throw new Error(`cannot specify init.signal, use the abort callback instead`);
    }
  }, [init]);

  useEffect(() => {
    if (!shouldFetch) {
      dispatch(reset());
      return;
    }

    dispatch(pending());

    fetch(input, { ...init, signal: abortController.signal })
      .then((response) => dispatch(resolve(response)))
      .catch((error) => dispatch(reject(error)));

    return () => {
      abortController.abort();
    };
  }, [shouldFetch, input, init, abortController]);

  return { ...state, abort };
};
