import { ApolloServer } from 'apollo-server';
import schema from './graphql/schema';
import { prisma } from './prisma/generated/prisma-client';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

export interface Context {
  prisma: typeof prisma;
}

const PORT = process.env.PORT || 3000;

export const getContext: ContextFunction<ExpressContext, Context> = () => ({
  prisma,
});

export const server = new ApolloServer({
  schema,
  context: getContext,
});

if (require.main === module) {
  server.listen(PORT).then((serverInfo) => {
    console.log(`🚀 Server ready at ${serverInfo.url}`);
  });
}
