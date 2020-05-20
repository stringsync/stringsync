import { Redis } from 'ioredis';
import { Db, RawUser } from '../../data/db';
import { Logger } from 'winston';
import { Queues } from '../../jobs';
import { Config } from '../../config';
import { DataLoaders } from '../../data/data-loaders';
import { Request } from 'express';
import { GraphQLSchema } from 'graphql';

export interface GlobalCtx {
  config: Config;
  logger: Logger;
  db: Db;
  redis: Redis;
  queues: Queues;
  schema: GraphQLSchema;
}

export interface Auth {
  user: RawUser | null;
  isLoggedIn: boolean;
  token: string;
}

export type Cookies = {
  USER_SESSION_TOKEN: string;
};

export interface GraphQLCtx extends GlobalCtx {
  req: Request;
  reqAt: Date;
  auth: Auth;
  cookies: Cookies;
  dataLoaders: DataLoaders;
  logger: Logger;
}
