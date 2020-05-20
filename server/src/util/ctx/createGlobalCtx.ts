import { Config } from '../../config';
import { GlobalCtx } from './types';
import { getLogger } from '../../util';
import { connectToDb } from '../../data/db';
import { connectToRedis } from '../../data/redis';
import { createQueues } from '../../jobs';
import { getSchema } from '../../resolvers';

export const createGlobalCtx = (config: Config): Readonly<GlobalCtx> => {
  const logger = getLogger();
  const db = connectToDb(config, logger);
  const redis = connectToRedis(config);
  const queues = createQueues(config);
  const schema = getSchema();

  return Object.freeze({
    config,
    logger,
    db,
    redis,
    queues,
    schema,
  });
};
