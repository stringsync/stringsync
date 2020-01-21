import { connectToDb } from './db';
import { getConfig } from './config';
import { getServer } from './server';
import { getSchema } from './resolvers';
import { getLogger } from './util';

const main = async (): Promise<void> => {
  const logger = getLogger();
  const config = getConfig(process.env);
  logger.info(`🦑  running in '${config.NODE_ENV}'`);

  const db = connectToDb(config);
  await db.authenticate({ logging: false });
  logger.info('🦑  connected to db');

  const schema = getSchema();
  const server = getServer(db, schema, logger, config);
  const port = config.PORT;
  await server.listen(port);
  logger.info(`🦑  ready on port ${port}`);
};

if (require.main === module) {
  main();
}
