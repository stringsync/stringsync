import { createDb } from './db/createDb';
import { createServer } from './modules/server';
import { getSchema } from './resolvers/getSchema';
import { getConfig } from './getConfig';

const main = async (): Promise<void> => {
  const config = getConfig();
  const db = createDb(config);
  const schema = getSchema();

  await db.connection.authenticate();
  console.log('🦑  Connected to db successfully!');

  const server = createServer(db, schema, config);
  const port = config.PORT;
  await server.listen(port);
  console.log(`🦑  Server ready on port ${port}`);
};

if (require.main === module) {
  main();
}
