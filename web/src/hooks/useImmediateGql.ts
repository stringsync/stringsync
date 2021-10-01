import { createReducer } from '@reduxjs/toolkit';
import { GraphQLError } from 'graphql';
import { isNull } from 'lodash';
import { useEffect, useMemo, useReducer } from 'react';
import { UNKNOWN_ERROR_MSG } from '../errors';
import { GRAPHQL_URI } from '../graphql';
import { $gql, Any$gql, FailedResponse, GqlResponseOf, SuccessfulResponse, VariablesOf } from '../graphql/$gql';
import { PromiseStatus } from '../util/types';
import { useAction } from './useAction';
import { FetchStatus, useImmediateFetch } from './useImmediateFetch';
import { useImmediatePromise } from './useImmediatePromise';
import { useMemoCmp } from './useMemoCmp';

export enum GqlStatus {
  Pending,
  Success,
  Failure,
}

export type GqlState<G extends Any$gql> =
  | {
      status: GqlStatus.Pending;
      response: null;
    }
  | {
      status: GqlStatus.Success;
      response: SuccessfulResponse<G>;
    }
  | {
      status: GqlStatus.Failure;
      response: FailedResponse;
    };

const getInitialState = <G extends Any$gql>(): GqlState<G> => ({ status: GqlStatus.Pending, response: null });

const createUnknownErrorResponse = (): FailedResponse => ({
  data: null,
  errors: [new GraphQLError(UNKNOWN_ERROR_MSG)],
});

const createNotFoundErrorResponse = (field: string): FailedResponse => ({
  data: null,
  errors: [new GraphQLError(`${field} not found`)],
});

const toGqlRes = async <G extends Any$gql>(
  res: Response | null,
  fetchError: Error | null,
  status: FetchStatus
): Promise<GqlResponseOf<G> | null> => {
  if (fetchError) {
    return null;
  }
  if (status === FetchStatus.Pending) {
    return null;
  }
  if (!res) {
    return null;
  }
  return await $gql.toGqlResponse(res);
};

export const useImmediateGql = <G extends Any$gql>(
  req: G,
  variables: VariablesOf<G>,
  immediate = true
): [GqlResponseOf<G> | null, GqlStatus] => {
  // Prevent the need for callers to have to memoize variables.
  variables = useMemoCmp(variables);

  const pending = useAction('loading');
  const success = useAction<{ response: SuccessfulResponse<G> }>('success');
  const failure = useAction<{ response: FailedResponse }>('failure');

  const graphqlRequestReducer = useMemo(() => {
    return createReducer(getInitialState<G>(), (builder) => {
      builder.addCase(pending, () => ({
        status: GqlStatus.Pending,
        response: null,
      }));
      builder.addCase(success, (state, action) => ({
        status: GqlStatus.Success,
        response: action.payload.response,
      }));
      builder.addCase(failure, (state, action) => ({
        status: GqlStatus.Failure,
        response: action.payload.response,
      }));
    });
  }, [pending, success, failure]);

  const [state, dispatch] = useReducer(graphqlRequestReducer, getInitialState());

  const reqInit = useMemo<RequestInit>(() => {
    return {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: req.toFormData(variables),
      credentials: 'include',
      mode: 'cors',
    };
  }, [req, variables]);
  const [fetchRes, fetchError, fetchStatus] = useImmediateFetch(GRAPHQL_URI, reqInit);
  const toGqlResPromise = useImmediatePromise(toGqlRes, [fetchRes, fetchError, fetchStatus]);

  useEffect(() => {
    if (fetchStatus === FetchStatus.Pending) {
      dispatch(pending());
    }
  }, [fetchStatus, pending]);

  const { status } = state;
  const { field } = req;
  useEffect(() => {
    if (status !== GqlStatus.Pending) {
      return;
    }
    if (toGqlResPromise.status === PromiseStatus.Pending) {
      return;
    }
    if (toGqlResPromise.error) {
      console.error(toGqlResPromise.error);
      dispatch(failure({ response: createUnknownErrorResponse() }));
      return;
    }
    if (!toGqlResPromise.result) {
      return;
    }
    if (!toGqlResPromise.result.data) {
      dispatch(failure({ response: createUnknownErrorResponse() }));
      return;
    }
    if (isNull(toGqlResPromise.result.data[field])) {
      dispatch(failure({ response: createNotFoundErrorResponse(field) }));
      return;
    }
    dispatch(success({ response: toGqlResPromise.result }));
  }, [toGqlResPromise, success, failure, field, status]);

  return [state.response, state.status];
};
