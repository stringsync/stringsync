import { Redis } from 'ioredis';
import { Db } from '../db';
import { Logger } from 'winston';
import { Queues } from '../jobs';
import { Config } from '../config';

export interface GlobalCtx {
  config: Config;
  logger: Logger;
  db: Db;
  redis: Redis;
  queues: Queues;
}
