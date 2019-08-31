import { RequestHandler } from 'express';
import graphqlHTTP from 'express-graphql';
import { prisma } from '../prisma/generated/prisma-client';
import { schema } from '../graphql/schema';

export const graphql: RequestHandler = graphqlHTTP({
  schema,
  graphiql: true,
  context: {
    prisma,
  },
});
