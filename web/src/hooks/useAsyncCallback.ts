import { createReducer } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
import { isNull, noop } from 'lodash';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { PromiseState, PromiseStatus } from '../util/types';
import { useAction } from './useAction';
import { useStateRef } from './useStateRef';

export type AsyncCallback<T, A extends any[]> = (...args: A) => Promise<T>;

export type CleanupCallback = (done: boolean) => void;

export type AsyncCallbackInvoker<A extends any[]> = (...args: A) => void;

type Invocation<A extends any[]> = {
  id: symbol;
  args: A;
  invoked: boolean;
};

/**
 * This hook wraps an ansynchronous callback and tracks the state of the resulting promise. It prevents the need of
 * doing this manually.
 *
 * @param asyncCallback
 * @param onCleanup
 * @returns
 */
export const useAsyncCallback = <T, A extends any[]>(
  asyncCallback: AsyncCallback<T, A>,
  onCleanup: CleanupCallback = noop
): [AsyncCallbackInvoker<A>, PromiseState<T>] => {
  const [invocation, invocationRef, setInvocation] = useStateRef<Invocation<A> | null>(null);

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

  const invoke = useCallback(
    (...args: A) => {
      setInvocation({ id: Symbol(), args, invoked: false });
    },
    [setInvocation]
  );

  useEffect(() => {
    if (isNull(invocation)) {
      return;
    }

    const didInvokeAgain = () => !!(invocationRef.current && invocationRef.current.id !== invocation.id);

    let cancelled = false;
    let done = false;

    dispatch(pending());

    asyncCallback(...invocation.args)
      .then((result) => !cancelled && dispatch(resolve({ result })))
      .catch((error) => !cancelled && dispatch(reject({ error })))
      .finally(() => (done = true));

    return () => {
      cancelled = !done || didInvokeAgain();
      onCleanup(done);
    };
  }, [invocation, invocationRef, setInvocation, asyncCallback, pending, resolve, reject, onCleanup]);

  return [invoke, state];
};
