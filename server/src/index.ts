import { createDb } from './db/createDb';
import { createDbConnection } from './db//createDbConnection';
import { createServer } from './modules/server';
import { getSchema } from './resolvers/getSchema';
import { getConfig } from './getConfig';

const main = async (): Promise<void> => {
  const config = getConfig(process.env);
  console.log(`🦑  running in '${config.NODE_ENV}'`);

  const connection = createDbConnection(config);
  const db = createDb(connection);
  await db.authenticate({ logging: false });
  console.log('🦑  connected to db');

  const schema = getSchema();
  const server = createServer(db, schema, config);
  const port = config.PORT;
  await server.listen(port);
  console.log(`🦑  ready on port ${port}`);
};

if (require.main === module) {
  main();
}
