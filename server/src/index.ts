import { connectToDb } from './db';
import { getConfig } from './config';
import { getServer } from './server';
import { getSchema } from './resolvers';

const main = async (): Promise<void> => {
  const config = getConfig(process.env);
  console.log(`🦑  running in '${config.NODE_ENV}'`);

  const db = connectToDb(config);
  await db.authenticate({ logging: false });
  console.log('🦑  connected to db');

  const schema = getSchema();
  const server = getServer(db, schema, config);
  const port = config.PORT;
  await server.listen(port);
  console.log(`🦑  ready on port ${port}`);
};

if (require.main === module) {
  main();
}
