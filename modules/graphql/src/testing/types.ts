import { GraphQLError } from 'graphql';
import { OnlyKey } from '@stringsync/common';

export type CallResponse<T, N extends string> = {
  errors?: GraphQLError[];
  data: OnlyKey<N, T>;
};
