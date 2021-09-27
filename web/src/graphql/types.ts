import { GraphQLError } from 'graphql';
import { OnlyKey } from '../util/types';
import { Mutation, Query } from './graphqlTypes';

export type RequestType = Query | Mutation;

export type RequestVariables = Record<string, any> | void;

export type RequestNamesOf<T extends RequestType> = Exclude<keyof T, '__typename'>;

export type RequestBody<V extends Record<string, any> | void = void> = {
  query?: string;
  mutation?: string;
  variables: V;
};

export enum ResponseType {
  Unknown,
  Success,
  Failure,
}

export type SuccessfulResponse<T extends RequestType, N extends RequestNamesOf<T>> = {
  data: OnlyKey<N, T[N]>;
  errors?: never;
};

export type FailedResponse = {
  data: null;
  errors: GraphQLError[];
};

export type GraphqlResponse<T extends RequestType, N extends RequestNamesOf<T>> =
  | SuccessfulResponse<T, N>
  | FailedResponse;
