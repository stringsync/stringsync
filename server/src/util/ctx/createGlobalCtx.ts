import { Config } from '../../config';
import { GlobalCtx } from './types';
import { getLogger } from '../../util/logger';
import { connectToDb } from '../../data/db';
import { connectToRedis } from '../../data/redis';
import { createQueues } from '../../jobs';
import { TRANSACTION_NAMESPACE } from '../../data/db/constants';

export const createGlobalCtx = (config: Config): Readonly<GlobalCtx> => {
  const logger = getLogger();
  const namespace = TRANSACTION_NAMESPACE;
  const db = connectToDb(config, namespace, logger);
  const redis = connectToRedis(config);
  const queues = createQueues(config);

  return {
    config,
    logger,
    db,
    redis,
    queues,
  };
};
