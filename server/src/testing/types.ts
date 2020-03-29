import { Models, Db } from '../db';
import {
  RequestOptions,
  ResponseOptions,
  MockRequest,
  MockResponse,
  Cookies,
} from 'node-mocks-http';
import { Request, Response } from 'express';
import { ReqCtx, GlobalCtx } from '../ctx';
import { Config } from '../config';
import { Queues } from '../jobs';
import { Redis } from 'ioredis';

export interface MockExpressContext {
  req: MockRequest<Request>;
  res: MockResponse<Response>;
}

export interface ExpressContextOptions {
  req?: RequestOptions;
  res?: ResponseOptions;
}

export type CtxOptions = {
  requestedAt?: Date;
  cookies?: Cookies;
};

export type FixtureMap = Partial<
  {
    [M in keyof Models]: any[];
  }
>;

export type DbCallback<A extends any[]> = (db: Db, ...args: A) => Promise<any>;

export type GlobalCtxCallback<A extends any[]> = (
  ctx: GlobalCtx,
  ...args: A
) => any;

export type CtxCallback<A extends any[]> = (
  ctx: ReqCtx<MockExpressContext>,
  ...args: A
) => any;

export interface GlobalCtxPatch {
  config?: Partial<Config>;
  fixtures?: FixtureMap;
}

export interface ReqCtxPatch extends GlobalCtxPatch {
  requestedAt?: Date;
  cookies?: Cookies;
  headers?: object;
}

export interface CleanupServices {
  db?: Db;
  queues?: Queues;
  redis?: Redis;
}
