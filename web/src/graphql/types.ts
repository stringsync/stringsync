import { GraphQLError } from 'graphql';
import { OnlyKey } from '../util/types';
import { Mutation, Query } from './graphqlTypes';

export type RequestType = Query | Mutation;

export type RequestBody<V extends Record<string, any> | void = void> = {
  query?: string;
  mutation?: string;
  variables: V;
};

export type Response<T extends RequestType, N extends Exclude<keyof T, '__typename'>> = {
  errors?: GraphQLError[];
  data: OnlyKey<N, T[N]>;
};
