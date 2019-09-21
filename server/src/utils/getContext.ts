import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

export interface Context {}

const getContext: ContextFunction<ExpressContext, Context> = () => ({});

export default getContext;
