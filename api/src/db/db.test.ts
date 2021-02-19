import { container } from '../inversify.config';
import { SequelizeDb } from './sequelize';
import { Db } from './types';

describe.each([['SequelizeDb', SequelizeDb]])('%s', (name, Ctor) => {
  const id = Symbol(name);
  let db: Db;

  beforeAll(() => {
    container.bind<Db>(id).to(Ctor);
    db = container.get(id);
  });

  afterAll(async () => {
    await db.closeConnection();
  });

  describe('init', () => {
    it('can be run multiple times', async () => {
      await expect(db.init()).resolves.not.toThrow();
      await expect(db.init()).resolves.not.toThrow();
    });
  });

  describe('cleanup', () => {
    it('can be run multiple times', async () => {
      await expect(db.cleanup()).resolves.not.toThrow();
      await expect(db.cleanup()).resolves.not.toThrow();
    });
  });
});
