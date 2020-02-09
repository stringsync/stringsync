import { MAIL } from './constants';
import { Queue, QueueOptions } from 'bullmq';
import { Queues } from './types';
import { Redis } from 'ioredis';

export const createQueues = (redis: Redis): Queues => {
  const queueOptions: Readonly<QueueOptions> = Object.freeze({
    connection: redis,
  });

  return {
    [MAIL]: new Queue(MAIL, queueOptions),
  };
};
