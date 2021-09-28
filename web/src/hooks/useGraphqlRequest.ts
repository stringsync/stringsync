import { createReducer } from '@reduxjs/toolkit';
import { GraphQLError } from 'graphql';
import { castDraft } from 'immer';
import { isObject } from 'lodash';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { UNKNOWN_ERROR_MSG } from '../errors';
import * as graphql from '../graphql';
import { Any$gql, GraphqlResponseOf, VariablesOf } from '../graphql/$gql';
import { useAction } from './useAction';
import { FetchStatus, useFetch } from './useFetch';
import { useMemoCmp } from './useMemoCmp';
import { PromiseStatus, usePromise } from './usePromise';

type State<G extends Any$gql> = {
  response: GraphqlResponseOf<G> | null;
  isLoading: boolean;
};

export const useGraphqlRequest = <G extends Any$gql>(
  req: G,
  variables: VariablesOf<G>
): [GraphqlResponseOf<G> | null, boolean] => {
  variables = useMemoCmp(variables);

  const loading = useAction('loading');
  const settled = useAction<{ response: GraphqlResponseOf<G> }>('settled');

  const getInitialState = useCallback((): State<G> => ({ response: null, isLoading: true }), []);

  const graphqlRequestReducer = useMemo(() => {
    return createReducer(getInitialState(), (builder) => {
      builder.addCase(loading, (state) => {
        state.isLoading = true;
        state.response = null;
      });
      builder.addCase(settled, (state, action) => {
        state.isLoading = false;
        state.response = castDraft(action.payload.response);
      });
    });
  }, [getInitialState, loading, settled]);

  const [state, dispatch] = useReducer(graphqlRequestReducer, getInitialState());

  const isGraphqlResponse = useCallback((value: any): value is GraphqlResponseOf<G> => {
    return isObject(value) && 'data' in value;
  }, []);

  const createUnknownErrorResponse = useCallback((): GraphqlResponseOf<G> => {
    const res = { data: null, errors: [new GraphQLError(UNKNOWN_ERROR_MSG)] };
    if (!isGraphqlResponse(res)) {
      throw Error('response is not conformant');
    }
    return res;
  }, [isGraphqlResponse]);

  const extract = useCallback(
    async (
      res: Response | null,
      fetchError: Error | null,
      status: FetchStatus
    ): Promise<GraphqlResponseOf<G> | null> => {
      if (fetchError) {
        return null;
      }

      if (status === FetchStatus.Pending) {
        return null;
      }

      if (!res) {
        return null;
      }

      const contentType = res.headers.get('content-type');
      if (!contentType?.toLowerCase().includes('application/json')) {
        console.warn(`unexpected content-type for graphql query: ${contentType}`);
        return createUnknownErrorResponse();
      }

      const json = await res.json();
      if (!isGraphqlResponse(json)) {
        console.warn('unexpected graphql response from server');
        return createUnknownErrorResponse();
      }

      return json;
    },
    [isGraphqlResponse, createUnknownErrorResponse]
  );

  const reqInit = useMemo<RequestInit>(
    () => ({
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: req.toFormData(variables),
      credentials: 'include',
      mode: 'cors',
    }),
    [req, variables]
  );

  const [fetchRes, fetchError, fetchStatus] = useFetch(graphql.URI, reqInit);
  const [extractResult, extractError, extractStatus] = usePromise(extract, [fetchRes, fetchError, fetchStatus]);

  useEffect(() => {
    if (fetchStatus === FetchStatus.Pending) {
      dispatch(loading());
    }
  }, [fetchStatus, loading]);

  useEffect(() => {
    if (extractStatus === PromiseStatus.Pending) {
      return;
    }

    if (extractError) {
      console.error(extractError);
      dispatch(settled({ response: createUnknownErrorResponse() }));
      return;
    }

    if (!extractResult) {
      return;
    }

    // This could still have errors in it, but we let the caller decide if they want to do anything with them.
    dispatch(settled({ response: extractResult }));
  }, [extractStatus, extractError, extractResult, settled, createUnknownErrorResponse]);

  return [state.response, state.isLoading];
};
