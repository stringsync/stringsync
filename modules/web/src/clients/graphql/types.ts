import { GraphQLError } from 'graphql';

export type OnlyKey<K extends string, V = any> = {
  [P in K]: V;
};

export type CallResponse<T, N extends string> = {
  errors?: GraphQLError[];
  data?: OnlyKey<N, T>;
};

export type RequestBody<V extends Record<string, any> | void = void> = {
  query?: string;
  mutation?: string;
  variables: V;
};
