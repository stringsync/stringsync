import { OnlyKey } from '@stringsync/common';
import { Response as ExpressResponse } from 'express';
import { GraphQLError } from 'graphql';
import { Mutation, Query } from './graphqlTypes';

export type RequestType = Query | Mutation;

export type Body<T extends RequestType, N extends Exclude<keyof T, '__typename'>> = {
  errors?: GraphQLError[];
  data: OnlyKey<N, T[N]>;
};

export type Response<T extends RequestType, N extends Exclude<keyof T, '__typename'>> = ExpressResponse & {
  body: Body<T, N>;
};
