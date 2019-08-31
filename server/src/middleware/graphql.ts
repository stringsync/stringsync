import { RequestHandler } from 'express';
import graphqlHTTP from 'express-graphql';
import { prisma } from '../prisma/generated/prisma-client';
import { schema } from '../graphql/schema';
import { StringSync } from '@/types/string-sync';

export const graphql: StringSync.RequestHandler = graphqlHTTP({
  schema,
  graphiql: true,
  context: {
    prisma,
  },
});
