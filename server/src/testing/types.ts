import { Db } from '../data/db';
import { Queues } from '../jobs';
import { Redis } from 'ioredis';

export interface CleanupServices {
  db?: Db;
  queues?: Queues;
  redis?: Redis;
}
