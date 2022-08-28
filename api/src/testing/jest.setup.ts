import { Db } from '../db';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { Cache } from '../util';
import { toHaveErrorCode, toHaveTaskCount, toHaveTaskWithPayload } from './matchers';

expect.extend({
  toHaveErrorCode,
  toHaveTaskWithPayload,
  toHaveTaskCount,
});

let db: Db;
let cache: Cache;

beforeAll(async () => {
  db = container.get<Db>(TYPES.Db);
  cache = container.get<Cache>(TYPES.Cache);
  await db.init();
});

afterEach(async () => {
  await Promise.all([db.cleanup(), cache.cleanup()]);
});

afterAll(async () => {
  await Promise.all([db.closeConnection(), cache.teardown()]);
});
