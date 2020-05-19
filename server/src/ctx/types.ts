import { Redis } from 'ioredis';
import { Db, RawUser } from '../db';
import { Logger } from 'winston';
import { Queues } from '../jobs';
import { Config } from '../config';
import { getDataLoaders } from '../data-loaders';

export interface GlobalCtx {
  config: Config;
  logger: Logger;
  db: Db;
  redis: Redis;
  queues: Queues;
}

export interface Auth {
  user: RawUser | null;
  isLoggedIn: boolean;
  token: string;
}

export type Cookies = {
  USER_SESSION_TOKEN: string;
};

export interface ReqCtx<E extends any = any> extends GlobalCtx {
  requestedAt: Date;
  auth: Auth;
  cookies: Cookies;
  dataLoaders: ReturnType<typeof getDataLoaders>;
  logger: Logger;
  req: E['req'];
  res: E['res'];
}
