import { Db } from '../db';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { Cache } from '../util';
import { toHaveErrorCode } from './matchers';

expect.extend({
  toHaveErrorCode,
});

let db: Db;
let cache: Cache;

beforeAll(async () => {
  db = container.get<Db>(TYPES.Db);
  cache = container.get<Cache>(TYPES.Cache);
  const start = new Date();
  await db.init();
});

afterEach(async () => {
  await Promise.all([db.cleanup(), cache.cleanup()]);
});

afterAll(async () => {
  await Promise.all([db.closeConnection(), cache.teardown()]);
});
