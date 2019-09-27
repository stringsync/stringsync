import { ApolloServer, ApolloError } from 'apollo-server';
import { createServerContext } from './util/createServerContext';
import db from './util/db';
import { schema } from './resolvers/schema';

const PORT = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

export const server = new ApolloServer({
  schema,
  context: createServerContext,
  formatError: (e) => {
    // We don't care about non prod environments
    if (env !== 'production') {
      return e;
    }

    // Do not expose internal service error stacktraces to clients
    if (e.extensions.code === 'INTERNAL_SERVER_ERROR') {
      console.error(JSON.stringify(e));
      return new ApolloError('something went wrong', 'INTERNAL_SERVER_ERROR');
    }

    // If not an internal server error, we probably should
    // forward it to the client and let it handle it
    return e;
  },
});

const main = async () => {
  // connect to db
  await db.authenticate();
  console.log('🦑  Connected to db successfully!');

  // start server
  const serverInfo = await server.listen(PORT);
  console.log(`🦑  Server ready at ${serverInfo.url}`);
};

// runs if the file was executed directly (vs. imported)
if (require.main === module) {
  main();
}
