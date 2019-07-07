import { GraphQLServer } from 'graphql-yoga';
import { prisma } from './prisma/generated/prisma-client';
import resolvers from './graphql/resolvers';

const server = new GraphQLServer({
  typeDefs: './graphql/schema.graphql',
  resolvers,
  context: request => ({
    ...request,
    prisma,
  }),
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
