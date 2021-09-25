import { Reducer, useEffect, useReducer } from 'react';

export type AsyncCallback<A extends any[], T> = (...args: A) => Promise<T>;

export enum PromiseStatus {
  Pending,
  Rejected,
  Resolved,
}

export type PromiseState<T> = {
  result: T | undefined;
  error: Error | undefined;
  status: PromiseStatus;
};

enum ActionType {
  Pending,
  Resolved,
  Rejected,
}

type Action<T> =
  | { type: ActionType.Pending }
  | { type: ActionType.Resolved; result: T }
  | { type: ActionType.Rejected; error: Error };

const DEFAULT_STATE: PromiseState<any> = Object.freeze({
  result: undefined,
  error: undefined,
  status: PromiseStatus.Pending,
});

const reducer = <T>(state: PromiseState<T>, action: Action<T>): PromiseState<T> => {
  switch (action.type) {
    case ActionType.Pending:
      return {
        result: undefined,
        error: undefined,
        status: PromiseStatus.Pending,
      };
    case ActionType.Resolved:
      return {
        result: action.result,
        error: undefined,
        status: PromiseStatus.Resolved,
      };
    case ActionType.Rejected:
      return {
        result: undefined,
        error: action.error,
        status: PromiseStatus.Rejected,
      };
    default:
      return state;
  }
};

export const usePromise = <A extends any[], T>(callback: AsyncCallback<A, T>, args: A) => {
  const [state, dispatch] = useReducer<Reducer<PromiseState<T>, Action<T>>>(reducer, DEFAULT_STATE);

  useEffect(() => {
    let cancelled = false;

    const resolve = (result: T) =>
      !cancelled &&
      dispatch({
        type: ActionType.Resolved,
        result,
      });
    const reject = (error: Error) =>
      !cancelled &&
      dispatch({
        type: ActionType.Rejected,
        error,
      });

    dispatch({ type: ActionType.Pending });

    callback
      .apply(args)
      .then(resolve)
      .catch(reject);

    return () => {
      cancelled = true;
    };
  }, [callback, args]);

  return state;
};
