import { container } from '../inversify.config';
import { MikroORMDb } from './mikro-orm';
import { Db } from './types';

describe.each([['MikroOrmDb', MikroORMDb]])('%s', (name, Ctor) => {
  const id = Symbol(name);
  let db: Db;

  beforeAll(async () => {
    container.bind<Db>(id).to(Ctor);
    db = container.get(id);
  });

  afterAll(async () => {
    container.unbind(id);
    await db.closeConnection();
  });

  describe('init', () => {
    it('is idempotent', async () => {
      await expect(db.init()).resolves.not.toThrow();
      await expect(db.init()).resolves.not.toThrow();
    });
  });

  describe('checkHealth', () => {
    it('returns true when healthy', async () => {
      await db.init();
      await expect(db.checkHealth()).resolves.toBeTrue();
    });
  });
});
