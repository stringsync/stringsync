import { Config } from '../../config';
import { GlobalCtx } from './types';
import { getLogger } from '../../util/logger';
import { connectToDb } from '../../data/db';
import { connectToRedis } from '../../data/redis';
import { createQueues } from '../../jobs';
import { createNamespace } from 'cls-hooked';
import { TRANSACTION_NAMESPACE_NAME } from '../../data/db/constants';

export const createGlobalCtx = (config: Config): Readonly<GlobalCtx> => {
  const logger = getLogger();
  const namespace = createNamespace(TRANSACTION_NAMESPACE_NAME);
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
