import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import db from './db';

export interface Context {}

const getContext: ContextFunction<ExpressContext, Context> = () => ({
  db,
});

export default getContext;
