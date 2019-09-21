import { ApolloServer } from 'apollo-server';
import schema from './graphql/schema';
import getContext from './utils/getContext';

const PORT = process.env.PORT || 3000;

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
