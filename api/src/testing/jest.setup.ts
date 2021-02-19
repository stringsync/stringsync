import { Db } from '../db';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { toHaveErrorCode } from './matchers';

expect.extend({
  toHaveErrorCode,
});

let db: Db;

beforeAll(() => {
  db = container.get<Db>(TYPES.Db);
});

afterEach(async () => {
  if (db) {
    await db.cleanup();
  }
});

afterAll(async () => {
  if (db) {
    await db.closeConnection();
  }
});
