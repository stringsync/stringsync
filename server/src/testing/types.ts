import { Models } from '../db';
import {
  RequestOptions,
  ResponseOptions,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';
import { Request, Response } from 'express';

export interface MockExpressContext {
  req: MockRequest<Request>;
  res: MockResponse<Response>;
}

export interface ExpressContextOptions {
  req?: RequestOptions;
  res?: ResponseOptions;
}

export type MockContextCreatorOptions = ExpressContextOptions & {
  requestedAt?: Date;
};

export type FixtureMap = Partial<
  {
    [M in keyof Models]: any[];
  }
>;
