import { connectToDb } from './db';
import { connectToRedis } from './redis';
import { getConfig } from './config';
import { getLogger } from './util';
import { getSchema } from './resolvers';
import { getServer } from './server';

const main = async (): Promise<void> => {
  const logger = getLogger();
  const config = getConfig(process.env);
  logger.info(`🦑  running in '${config.NODE_ENV}'`);

  const redis = connectToRedis(config);
  logger.info(`🦑  connected to redis`);

  const db = connectToDb(config);
  await db.authenticate({ logging: false });
  logger.info('🦑  connected to db');

  const schema = getSchema();
  const server = getServer(db, schema, logger, redis, config);
  const port = config.PORT;
  await server.listen(port);
  logger.info(`🦑  ready on port ${port}`);
};

if (require.main === module) {
  main();
}
