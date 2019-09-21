import { ApolloServer } from 'apollo-server';
import schema from './graphql/schema';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

const PORT = process.env.PORT || 3000;

export interface Context {}

export const getContext: ContextFunction<ExpressContext, Context> = () => ({});

export const server = new ApolloServer({
  schema,
  context: getContext,
});

// only start the server if the file was run directly
if (require.main === module) {
  server.listen(PORT).then((serverInfo) => {
    console.log(`🚀 Server ready at ${serverInfo.url}`);
  });
}
