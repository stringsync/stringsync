import { createReducer } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
import { noop } from 'lodash';
import { useCallback, useMemo, useReducer } from 'react';
import { PromiseState, PromiseStatus } from '../util/types';
import { useAction } from './useAction';

export type AsyncCallback<T> = () => Promise<T>;

export type CleanupCallback = (done: boolean) => void;

type SyncCallback = () => void;

export const usePromiseExec = <T>(
  callback: AsyncCallback<T>,
  onCleanup: CleanupCallback = noop
): [SyncCallback, PromiseState<T>] => {
  const pending = useAction('pending');
  const resolve = useAction<{ result: T }>('resolve');
  const reject = useAction<{ error: Error }>('reject');

  const getInitialState = useCallback(
    (): PromiseState<T> => ({
      status: PromiseStatus.Idle,
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

  const exec = useCallback(() => {
    let cancelled = false;
    let done = false;

    dispatch(pending());

    callback()
      .then((result) => !cancelled && dispatch(resolve({ result })))
      .catch((error) => !cancelled && dispatch(reject({ error })))
      .finally(() => (done = true));

    return () => {
      cancelled = !done;
      onCleanup(done);
    };
  }, [callback, pending, resolve, reject, onCleanup]);

  return [exec, state];
};
