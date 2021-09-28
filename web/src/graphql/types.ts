import { GraphQLError } from 'graphql';
import { OnlyKey } from '../util/types';
import { Mutation, Query } from './graphqlTypes';

export type Root = Query | Mutation;

export type Fields<T extends Root> = keyof T;

export type SuccessfulResponse<T extends Root, N extends Fields<T>> = {
  data: OnlyKey<N, T[N]>;
  errors?: never;
};

export type FailedResponse = {
  data: null;
  errors: GraphQLError[];
};

export type GraphqlResponse<T extends Root, N extends Fields<T>> = SuccessfulResponse<T, N> | FailedResponse;
