import { Express, Response as ExpressResponse } from 'express';
import { GraphQLError, GraphQLSchema } from 'graphql';
import { Container } from 'inversify';
import { OnlyKey } from '../util';
import { Mutation, Query } from './graphqlTypes';

export type RequestType = Query | Mutation;

export type Body<T extends RequestType, N extends keyof T> = {
  errors?: GraphQLError[];
  data: OnlyKey<N, T[N]>;
};

export type Response<T extends RequestType, N extends keyof T> = ExpressResponse & {
  body: Body<T, N>;
};

export type TestAppRef = {
  container: Container;
  app: Express;
  schema: GraphQLSchema;
};
