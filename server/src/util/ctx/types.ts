import { Redis } from 'ioredis';
import { Db } from '../../data/db';
import { Logger } from 'winston';
import { Queues } from '../../jobs';
import { Config } from '../../config';
import { DataLoaders } from '../../data/data-loaders';
import { Request, Response } from 'express';
import { GraphQLSchema } from 'graphql';
import { SessionUser } from '../session';

export interface GlobalCtx {
  config: Config;
  logger: Logger;
  db: Db;
  redis: Redis;
  queues: Queues;
  schema: GraphQLSchema;
}

export type SessionRequest = Request & {
  session: Express.Session & { user: SessionUser };
  sessionID: string;
};

export interface ResolverCtx extends GlobalCtx {
  req: SessionRequest;
  res: Response;
  reqAt: Date;
  dataLoaders: DataLoaders;
}