import { Db } from '../../db/createDb';
import express, { Express } from 'express';
import { installMiddlewares } from './installMiddlewares';
import { GraphQLSchema } from 'graphql';

export interface CreateAppOptions {
  db: Db;
  clientUri: string;
  env: string;
  schema: GraphQLSchema;
}

export const createApp = (opts: CreateAppOptions): Express => {
  const app = express();
  installMiddlewares(app, opts);
  return app;
};
