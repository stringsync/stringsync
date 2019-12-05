import { Models } from '../db';
import { RequestOptions, ResponseOptions } from 'node-mocks-http';

export interface ExpressContextOptions {
  req?: RequestOptions;
  res?: ResponseOptions;
}

export type FixtureMap = Partial<
  {
    [M in keyof Models]: any[];
  }
>;
