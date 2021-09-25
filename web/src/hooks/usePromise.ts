import { noop } from 'lodash';
import { useEffect, useReducer } from 'react';

export type AsyncCallback<A extends any[], T> = (...args: A) => Promise<T>;

type CleanupCallback = (done: boolean) => void;

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

const INITIAL_STATE: PromiseState<any> = Object.freeze({
  status: PromiseStatus.Pending,
  result: undefined,
  error: undefined,
});

export const usePromise = <A extends any[], T>(
  callback: AsyncCallback<A, T>,
  args: A,
  onCleanup: CleanupCallback = noop
) => {
  const [state, dispatch] = useReducer((state: PromiseState<T>, action: Action<T>): PromiseState<T> => {
    switch (action.type) {
      case ActionType.Pending:
        return { status: PromiseStatus.Pending, result: undefined, error: undefined };
      case ActionType.Resolved:
        return { status: PromiseStatus.Resolved, result: action.result, error: undefined };
      case ActionType.Rejected:
        return { status: PromiseStatus.Rejected, result: undefined, error: action.error };
      default:
        return state;
    }
  }, INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;
    let done = false;

    const resolve = (result: T) => {
      done = true;
      if (!cancelled) {
        dispatch({ type: ActionType.Resolved, result });
      }
    };
    const reject = (error: Error) => {
      done = true;
      if (!cancelled) {
        dispatch({ type: ActionType.Rejected, error });
      }
    };

    dispatch({ type: ActionType.Pending });

    callback
      .apply(null, args)
      .then(resolve)
      .catch(reject);

    return () => {
      cancelled = true;
      onCleanup(done);
    };
  }, [callback, args, onCleanup]);

  return state;
};
