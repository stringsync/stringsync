import { GraphQLError } from 'graphql';
import { OnlyKey } from '@stringsync/common';
import { Response as ExpressResponse } from 'express';

export type Body<T, N extends string> = {
  errors?: GraphQLError[];
  data: OnlyKey<N, T>;
};

export type Response<T, N extends string> = ExpressResponse & { body: Body<T, N> };
