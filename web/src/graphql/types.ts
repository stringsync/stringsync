import { GraphQLError } from 'graphql';
import { OnlyKey } from '../util/types';
import { GraphqlRequest } from './GraphqlRequest';
import { Mutation, Query } from './graphqlTypes';

export type RequestType = Query | Mutation;

export type RequestVariables = Record<string, any> | void;

export type RequestNamesOf<T extends RequestType> = Exclude<keyof T, '__typename'>;

export type RequestBody<V extends Record<string, any> | void = void> = {
  query?: string;
  mutation?: string;
  variables: V;
};

export type SuccessfulResponse<T extends RequestType, N extends RequestNamesOf<T>> = {
  data: OnlyKey<N, T[N]>;
  errors?: never;
};

export type FailedResponse = {
  data: null;
  errors: GraphQLError[];
};

export type GraphqlResponse<T extends RequestType, N extends RequestNamesOf<T>> =
  | FailedResponse
  | SuccessfulResponse<T, N>;

export type GraphqlResponseOf<G> = G extends GraphqlRequest<Query, infer N, any>
  ? GraphqlResponse<Query, N>
  : G extends GraphqlRequest<Mutation, infer N, any>
  ? GraphqlResponse<Mutation, N>
  : never;

export type RequestVariablesOf<G> = G extends GraphqlRequest<any, any, infer V> ? V : never;
