import graphqlHTTP from 'express-graphql';
import { prisma } from '../prisma/generated/prisma-client';
import { schema } from '../graphql/schema';
import { StringSync } from '@/types/string-sync';

export const graphql: StringSync.RequestHandler = graphqlHTTP((req) => ({
  schema,
  graphiql: true,
  context: {
    req,
    prisma,
  },
}));
