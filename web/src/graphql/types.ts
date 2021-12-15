import { GraphQLError } from 'graphql';
import { DeepPartial, IsUnion, OnlyKey } from '../util/types';
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

export type GraphqlType<T extends string> = {
  __typename?: T;
};

export type Typenames<T extends GraphqlType<any>> = NonNullable<
  {
    [Typename in keyof T]: T['__typename'];
  }[keyof T]
>;

export type UnionSelection<T extends GraphqlType<any>> = {
  [Typename in Typenames<T>]: DeepPartial<Omit<Extract<T, GraphqlType<Typename>>, '__typename'>>;
};

export type GraphqlUnionSelection<T extends UnionSelection<any>> = {
  [Typename in keyof T]: { __typename: Typename } & T[Typename];
}[keyof T];

export type StrictSelection<T extends GraphqlType<any>> = IsUnion<Typenames<T>> extends true
  ? DeepPartial<T> & Required<Pick<T, '__typename'>>
  : DeepPartial<T>;
