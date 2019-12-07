import { Models, Db } from '../db';
import {
  RequestOptions,
  ResponseOptions,
  MockRequest,
  MockResponse,
  Cookies,
} from 'node-mocks-http';
import { Request, Response } from 'express';
import { RequestContext } from '../request-context';

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

export type CtxCallback<A extends any[]> = (
  ctx: RequestContext<MockExpressContext>,
  ...args: A
) => any;
