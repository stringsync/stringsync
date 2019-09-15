import { ApolloServer } from 'apollo-server';
import schema from './graphql/schema';

const server = new ApolloServer({
  schema,
});

server.listen().then((serverInfo) => {
  console.log(`🚀 Server ready at ${serverInfo.url}`);
});
