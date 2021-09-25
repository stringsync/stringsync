import { GraphQLError } from 'graphql';
import { isObject } from 'lodash';
import { useEffect, useMemo, useReducer } from 'react';
import { UNKNOWN_ERROR_MSG } from '../errors';
import * as graphql from '../graphql';
import { GraphqlRequest } from '../graphql/GraphqlRequest';
import { GraphqlResponseOf, RequestVariablesOf } from '../graphql/types';
import { FetchState, FetchStatus, useFetch } from './useFetch';
import { PromiseStatus, usePromise } from './usePromise';

type AnyGraphqlRequest = GraphqlRequest<any, any, any>;

export enum GraphqlRequestStatus {
  Pending,
  Settled,
}

enum ActionType {
  Pending,
  Settled,
}

export type GraphqlRequestState<G extends AnyGraphqlRequest> = {
  status: GraphqlRequestStatus;
  response: GraphqlResponseOf<G> | undefined;
};

type Action<G extends AnyGraphqlRequest> =
  | { type: ActionType.Pending }
  | { type: ActionType.Settled; response: GraphqlResponseOf<G> };

const INITIAL_STATE: GraphqlRequestState<AnyGraphqlRequest> = {
  status: GraphqlRequestStatus.Pending,
  response: undefined,
};

const graphqlRequestReducer = <G extends AnyGraphqlRequest>(
  state: GraphqlRequestState<G>,
  action: Action<G>
): GraphqlRequestState<G> => {
  switch (action.type) {
    case ActionType.Pending:
      return { status: GraphqlRequestStatus.Pending, response: undefined };
    case ActionType.Settled:
      return { status: GraphqlRequestStatus.Settled, response: action.response };
    default:
      return state;
  }
};

const isGraphqlResponse = <G extends AnyGraphqlRequest>(value: any): value is GraphqlResponseOf<G> => {
  return isObject(value) && 'data' in value;
};

const extract = async <G extends AnyGraphqlRequest>(fetchState: FetchState) => {
  if (fetchState.error) {
    return { data: null, errors: [new GraphQLError(UNKNOWN_ERROR_MSG)] };
  }

  if (fetchState.status === FetchStatus.Pending) {
    return null;
  }

  const res = fetchState.response;
  if (!res) {
    return null;
  }

  const contentType = res.headers.get('content-type');
  if (!contentType?.toLowerCase().includes('application/json')) {
    console.warn(`unexpected content-type for graphql query: ${contentType}`);
    return { data: null, errors: [new GraphQLError(UNKNOWN_ERROR_MSG)] };
  }

  const json = await res.json();
  if (!isGraphqlResponse<G>(json)) {
    console.warn(`unexpected graphql response from server`);
    return { data: null, errors: [new GraphQLError(UNKNOWN_ERROR_MSG)] };
  }

  return json;
};

export const useGraphqlRequest = <G extends AnyGraphqlRequest>(
  req: G,
  variables?: RequestVariablesOf<G>
): GraphqlRequestState<G> => {
  const [state, dispatch] = useReducer(
    (state: GraphqlRequestState<G>, action: Action<G>) => graphqlRequestReducer<G>(state, action),
    INITIAL_STATE
  );

  const requestInit = useMemo<RequestInit>(
    () => ({
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: req.toFormData(variables),
      credentials: 'include',
      mode: 'cors',
    }),
    [req, variables]
  );

  const fetchState = useFetch(graphql.URI, requestInit);
  const extractArgs = useMemo<[FetchState]>(() => [fetchState], [fetchState]);
  const extractState = usePromise(extract, extractArgs);

  useEffect(() => {
    if (extractState.status === PromiseStatus.Pending) {
      dispatch({ type: ActionType.Pending });
      return;
    }

    if (extractState.error) {
      console.error(extractState.error);
      dispatch({
        type: ActionType.Settled,
        response: { data: null, errors: [new GraphQLError(UNKNOWN_ERROR_MSG)] } as GraphqlResponseOf<G>,
      });
      return;
    }

    if (!extractState.result) {
      return;
    }

    dispatch({ type: ActionType.Settled, response: extractState.result as GraphqlResponseOf<G> });
  }, [extractState]);

  return state;
};
