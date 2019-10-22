import { createDb } from './db/createDb';
import { createApp } from './modules/app';
import { defaults } from 'lodash';
import { schema } from './resolvers/schema';

const DEFAULT_CREATE_APP_OPTIONS = Object.freeze({
  clientUri: '',
  env: 'development',
  schema,
});

const main = async (): Promise<void> => {
  const db = createDb();
  await db.connection.authenticate();
  console.log('🦑  Connected to db successfully!');

  const app = createApp(
    defaults(
      {
        db,
        clientUri: process.env.CLIENT_URI,
        env: process.env.NODE_ENV,
      },
      DEFAULT_CREATE_APP_OPTIONS
    )
  );
  const port = process.env.PORT || '3000';
  await app.listen(port);
  console.log(`🦑  Server ready on port ${port}`);
};

if (require.main === module) {
  main();
}
