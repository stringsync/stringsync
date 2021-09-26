import { createReducer } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
import { noop } from 'lodash';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useAction } from './useAction';

export type AsyncCallback<A extends any[], T> = (...args: A) => Promise<T>;

export type CleanupCallback = (done: boolean) => void;

export enum PromiseStatus {
  Pending,
  Rejected,
  Resolved,
}

type State<T> = {
  result: T | undefined;
  error: Error | undefined;
  status: PromiseStatus;
};

export const usePromise = <A extends any[], T>(
  callback: AsyncCallback<A, T>,
  args: A,
  onCleanup: CleanupCallback = noop
): [T | undefined, Error | undefined, PromiseStatus] => {
  const pending = useAction('pending');
  const resolve = useAction<{ result: T }>('resolve');
  const reject = useAction<{ error: Error }>('reject');

  const getInitialState = useCallback(
    (): State<T> => ({
      status: PromiseStatus.Pending,
      result: undefined,
      error: undefined,
    }),
    []
  );

  const promiseReducer = useMemo(() => {
    return createReducer(getInitialState(), (builder) => {
      builder.addCase(pending, (state) => {
        state.status = PromiseStatus.Pending;
        state.error = undefined;
        state.result = undefined;
      });
      builder.addCase(resolve, (state, action) => {
        state.status = PromiseStatus.Resolved;
        state.result = castDraft(action.payload.result);
      });
      builder.addCase(reject, (state, action) => {
        state.status = PromiseStatus.Rejected;
        state.error = action.payload.error;
      });
    });
  }, [getInitialState, pending, resolve, reject]);

  const [state, dispatch] = useReducer(promiseReducer, getInitialState());

  useEffect(() => {
    let cancelled = false;
    let done = false;

    dispatch(pending);

    callback
      .apply(null, args)
      .then((result) => !cancelled && dispatch(resolve({ result })))
      .catch((error) => !cancelled && dispatch(reject({ error })))
      .finally(() => (done = true));

    return () => {
      cancelled = true;
      onCleanup(done);
    };
  }, [callback, args, onCleanup, pending, resolve, reject]);

  return [state.result, state.error, state.status];
};
