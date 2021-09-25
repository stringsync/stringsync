import { GraphQLError } from 'graphql';
import { Reducer, useCallback, useEffect, useMemo, useReducer } from 'react';
import { UNKNOWN_ERROR_MSG } from '../errors';
import * as graphql from '../graphql/graphql';
import { RequestType, Response as GraphqlResponse } from '../graphql/types';
import { useFetch } from './useFetch';
import { useMemoCmp } from './useMemoCmp';
import { PromiseStatus, usePromise } from './usePromise';

export enum GraphqlStatus {
  Pending,
  Settled,
}

export type GraphqlState<T extends RequestType, N extends Exclude<keyof T, '__typename'>> = {
  status: GraphqlStatus;
  response: GraphqlResponse<T, N> | undefined;
};

enum ActionType {
  Pending,
  Settled,
}

type Action<T extends RequestType, N extends Exclude<keyof T, '__typename'>> =
  | { type: ActionType.Pending }
  | { type: ActionType.Settled; response: GraphqlResponse<T, N> };

const graphqlReducer = <T extends RequestType, N extends Exclude<keyof T, '__typename'>>(
  state: GraphqlState<T, N>,
  action: Action<T, N>
): GraphqlState<T, N> => {
  switch (action.type) {
    case ActionType.Pending:
      return { status: GraphqlStatus.Pending, response: undefined };
    case ActionType.Settled:
      return { status: GraphqlStatus.Settled, response: action.response };
    default:
      return state;
  }
};

export const useGraphql = <
  T extends RequestType,
  N extends Exclude<keyof T, '__typename'>,
  V extends Record<string, any> | void = void
>(
  query: string,
  variables?: V
) => {
  const [state, dispatch] = useReducer<Reducer<GraphqlState<T, N>, Action<T, N>>>(graphqlReducer, {
    response: undefined,
    status: GraphqlStatus.Pending,
  });

  const requestInit = useMemo<RequestInit>(
    () => ({
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: graphql.makeFormData(query, variables),
      credentials: 'include',
      mode: 'cors',
    }),
    [query, variables]
  );

  const fetchState = useFetch(graphql.URI, requestInit);

  const extract = useCallback(async (response: Response | undefined): Promise<GraphqlResponse<T, N> | null> => {
    if (!response) {
      return null;
    }
    const contentType = response.headers.get('content-type');
    if (!contentType?.toLowerCase().includes('application/json')) {
      return { data: null, errors: [new GraphQLError(UNKNOWN_ERROR_MSG)] };
    }
    return await response.json();
  }, []);
  const extractArgs = useMemoCmp<[Response | undefined]>([fetchState.response]);
  const extractState = usePromise(extract, extractArgs);

  useEffect(() => {
    if (extractState.status === PromiseStatus.Pending) {
      dispatch({ type: ActionType.Pending });
    } else if (!extractState.result) {
      return;
    } else if (extractState.status === PromiseStatus.Rejected) {
      dispatch({ type: ActionType.Settled, response: extractState.result });
    } else if (extractState.status === PromiseStatus.Resolved) {
      dispatch({ type: ActionType.Settled, response: extractState.result });
    }
  }, [extractState]);

  return state;
};
