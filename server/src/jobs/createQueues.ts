import { MAIL } from './constants';
import { Queue, QueueOptions } from 'bullmq';
import { Queues } from './types';
import { Config } from '../config';

export const createQueues = (config: Config): Queues => {
  const host = config.REDIS_HOST;
  const port = parseInt(config.REDIS_PORT, 10);

  const queueOptions: Readonly<QueueOptions> = Object.freeze({
    connection: {
      host,
      port,
    },
  });

  return {
    [MAIL]: new Queue(MAIL, queueOptions),
  };
};
