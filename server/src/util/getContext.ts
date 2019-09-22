import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import db from './db';

export interface Context {
  db: typeof db;
  requestedAt: Date;
}

const getContext: ContextFunction<ExpressContext, Context> = () => ({
  db,
  requestedAt: new Date(),
});

export default getContext;
