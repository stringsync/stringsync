import { createReducer } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
import { identity, isNull, noop } from 'lodash';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { PromiseResolver, PromiseState, PromiseStatus, UnwrapPromise } from '../util/types';
import { useAction } from './useAction';
import { useMemoCmp } from './useMemoCmp';
import { useStateRef } from './useStateRef';

export type AsyncCallback<T, A extends any[]> = (...args: A) => Promise<T>;

export type CancelCallback = () => void;

export type AsyncCallbackInvoker<A extends any[]> = (...args: A) => void;

type Invocation<A extends any[]> = {
  id: symbol;
  args: A;
  invoked: boolean;
};

const BASE_RESOLVER = {
  then: identity,
  catch: noop,
  cancel: noop,
  done: noop,
};

class CancelledPromiseError extends Error {
  constructor() {
    super('promise was cancelled');
  }
}

/**
 * This hook wraps an ansynchronous callback and tracks the state of the resulting promise. It prevents the need of
 * doing this manually.
 *
 * @param asyncCallback
 * @param onCancel
 * @returns
 */
export const useAsync = <T, A extends any[], R = T>(
  asyncCallback: AsyncCallback<T, A>,
  resolver: PromiseResolver<T, R> = BASE_RESOLVER
): [AsyncCallbackInvoker<A>, PromiseState<UnwrapPromise<R>>] => {
  resolver = useMemoCmp(resolver);
  const [invocation, invocationRef, setInvocation] = useStateRef<Invocation<A> | null>(null);

  const pending = useAction('pending');
  const resolve = useAction<{ result: UnwrapPromise<R> }>('resolve');
  const reject = useAction<{ error: Error }>('reject');

  const getInitialState = useCallback(
    (): PromiseState<UnwrapPromise<R>> => ({
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

    let cancelled = false;
    let done = false;

    const r: Required<PromiseResolver<T, R>> = { ...resolver, ...BASE_RESOLVER };
    const didInvokeAgain = () => !!(invocationRef.current && invocationRef.current.id !== invocation.id);
    const throwCancelled = () => { throw new CancelledPromiseError() }; // prettier-ignore

    dispatch(pending());

    asyncCallback(...invocation.args)
      .then((result) => (cancelled ? throwCancelled() : r.then(result)))
      .then((result) => !cancelled && dispatch(resolve({ result: result as UnwrapPromise<R> })))
      .catch((error) => !cancelled && dispatch(reject({ error })) && r.catch(error))
      .finally(() => (done = true) && !cancelled && r.done);

    return () => {
      cancelled = !done || didInvokeAgain();

      if (cancelled && resolver.cancel) {
        resolver.cancel();
      }
    };
  }, [invocation, invocationRef, setInvocation, asyncCallback, pending, resolve, reject, resolver]);

  return [invoke, state];
};
