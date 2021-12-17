import { noop } from 'lodash';
import { useCallback, useRef } from 'react';
import { useAsyncCallback, UseAsyncCallbackOptions } from 'react-async-hook';
import * as uuid from 'uuid';
import { MissingDataError } from '../errors';
import { Any$gql, GqlResponseOf, SuccessfulResponse, VariablesOf } from '../graphql';
import { notify } from '../lib/notify';

type BeforeLoadingCallback = () => void;
type OnDataCallback<G extends Any$gql> = (data: SuccessfulResponse<G>['data']) => void;
type OnErrorsCallback = (errors: string[]) => void;

export type UseGqlOptions<G extends Any$gql> = Partial<
  Omit<UseAsyncCallbackOptions<GqlResponseOf<G>>, 'onSuccess' | 'onErrors'> & {
    beforeLoading: BeforeLoadingCallback;
    onData: OnDataCallback<G>;
    onErrors: OnErrorsCallback;
  }
>;

export const useGql = <G extends Any$gql>(gql: G, opts?: UseGqlOptions<G>) => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const onData: OnDataCallback<G> = opts?.onData || noop;
  const onErrorsOverride = opts?.onErrors;
  const onErrors: OnErrorsCallback = useCallback(
    (errors) => {
      if (onErrorsOverride) {
        onErrorsOverride(errors);
      } else {
        const id = uuid.v4();
        notify.modal.error({
          title: 'error',
          content: errors.map((error, ndx) => <div key={`modal-${id}-${ndx}`}>{error}</div>),
        });
      }
    },
    [onErrorsOverride]
  );

  const { execute, loading } = useAsyncCallback(
    async (variables: VariablesOf<G>) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      if (opts?.beforeLoading) {
        opts.beforeLoading();
      }

      try {
        return await gql.fetch(variables, abortController.signal);
      } finally {
        abortControllerRef.current = null;
      }
    },
    {
      onSuccess: ({ data, errors }) => {
        if (errors) {
          onErrors(errors.map((error) => error.message));
        } else if (!data) {
          onErrors([new MissingDataError().message]);
        } else {
          onData(data);
        }
      },
      onError: (error) => {
        onErrors([error.message]);
      },
    }
  );

  return { execute, loading };
};
