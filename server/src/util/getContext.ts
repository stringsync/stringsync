import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import sequelize from './sequelize';

export interface Context {}

const getContext: ContextFunction<ExpressContext, Context> = () => ({
  db: sequelize,
});

export default getContext;
