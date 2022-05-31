import { GraphQLError } from 'graphql';
import { Union } from 'ts-toolbelt';
import { DeepPartial, IsUnion, OnlyKey } from '../../util/types';
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

export type GType<T extends string> = {
  __typename?: T;
};

export type GTypeOf<T extends GType<any>, Typename extends Typenames<T>> = Extract<Union.Strict<T>, GType<Typename>>;

export type Typenames<T extends GType<any>> = NonNullable<
  {
    [Typename in keyof T]: T['__typename'];
  }[keyof T]
>;

export type UnionSelection<T extends GType<any>> = {
  [Typename in Typenames<T>]: DeepPartial<Omit<GTypeOf<T, Typename>, '__typename'>> & {
    __typename: NonNullable<GTypeOf<T, Typename>['__typename']>;
  };
};

export type GraphqlUnionSelection<T extends UnionSelection<any>> = {
  [Typename in keyof T]: { __typename: Typename } & T[Typename];
}[keyof T];

export type StrictSelection<T extends GType<any>> = IsUnion<Typenames<T>> extends true
  ? DeepPartial<T> & Required<Pick<T, '__typename'>>
  : DeepPartial<T>;
