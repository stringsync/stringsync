import { MAIL_QUEUE } from './constants';
import { Queue, QueueOptions } from 'bullmq';
import { Queues } from './types';
import { Redis } from 'ioredis';

export const getQueues = (redis: Redis): Queues => {
  const queueOptions: Readonly<QueueOptions> = Object.freeze({
    connection: redis,
  });

  return {
    [MAIL_QUEUE]: new Queue(MAIL_QUEUE, queueOptions),
  };
};
