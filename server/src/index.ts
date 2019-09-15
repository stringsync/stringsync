import { ApolloServer } from 'apollo-server';
import schema from './graphql/schema';

const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
  schema,
});

server.listen(PORT).then((serverInfo) => {
  console.log(`🚀 Server ready at ${serverInfo.url}`);
});
