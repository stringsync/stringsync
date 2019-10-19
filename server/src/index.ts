import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloError } from 'apollo-server';
import { ApolloServer } from 'apollo-server-express';
import { getRequestContextCreator } from './modules/request-context/';
import { schema } from './resolvers/schema';
import { createDb } from './db/createDb';

const CLIENT_URI = process.env.CLIENT_URI;
const PORT = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

export const createApp = () => {
  const app = express();
  app.use(
    cors({
      origin: CLIENT_URI,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  return app;
};

const main = async (): Promise<void> => {
  const db = createDb();
  const app = createApp();

  const apolloServer = new ApolloServer({
    schema,
    context: getRequestContextCreator(db),
    formatError: (e: Error | ApolloError): Error => {
      if (env !== 'production') {
        return e;
      }

      // Do not expose internal service error stacktraces to clients

      if ('extensions' in e && e.extensions.code === 'INTERNAL_SERVER_ERROR') {
        console.error(JSON.stringify(e));
        return new ApolloError('something went wrong', 'INTERNAL_SERVER_ERROR');
      }

      // If not an internal server error, we probably should
      // forward it to the client and let it handle it
      return e;
    },
  });

  apolloServer.applyMiddleware({ app, cors: false });

  // connect to db
  await db.connection.authenticate();
  console.log('🦑  Connected to db successfully!');

  // start server
  await app.listen(PORT);
  console.log(`🦑  Server ready on port ${PORT}`);
};

// runs if the file was executed directly (vs. imported)
if (require.main === module) {
  main();
}
