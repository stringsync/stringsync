import { Db } from './types';
import { connectToDb } from './connectToDb';
import { getConfig } from '../../config';
import { getLogger } from '../../util/logger';
import { createUser } from '../../testing';
import { ForcedRollback } from './ForcedRollback';
import { TRANSACTION_NAMESPACE, TRANSACTION_NAMESPACE_NAME } from './constants';

const ID1 = '8aYmBzhvRC';
const ID2 = 'wjTMDY3ECg';

let db: Db;
const namespace = TRANSACTION_NAMESPACE;
const config = getConfig(process.env);
const logger = getLogger();

beforeEach(() => {
  db = connectToDb(config, namespace, logger);
});

afterEach(async () => {
  await db.User.destroy({ where: { id: [ID1, ID2] }, force: true });
  await db.sequelize.close();
});

const isUserPersisted = async (db: Db, id: string): Promise<boolean> => {
  const user = await db.User.findByPk(id);
  return user !== null;
};

it('sets the namespace within the callback', async () => {
  await db.transaction(async (t) => {
    const nst = namespace.get(TRANSACTION_NAMESPACE_NAME);
    expect(nst).toBeDefined();
    expect(t).toBe(nst);
  });
});

it('unsets the namespace outside the callback', async () => {
  await db.transaction(async () => {});
  const nst = namespace.get(TRANSACTION_NAMESPACE_NAME);
  expect(nst).toBeUndefined();
});

it('commits when no error thrown', async () => {
  await db.transaction(async () => {
    await createUser(db, { id: ID1 });
    expect(await isUserPersisted(db, ID1)).toBe(true);
  });

  expect(await isUserPersisted(db, ID1)).toBe(true);
});

it('rolls back when error thrown', async () => {
  try {
    await db.transaction(async () => {
      await createUser(db, { id: ID1 });
      expect(await isUserPersisted(db, ID1)).toBe(true);
      throw new ForcedRollback();
    });
  } catch (e) {
    expect(e).toBeInstanceOf(ForcedRollback);
  }

  expect(await isUserPersisted(db, ID1)).toBe(false);
});

it('returns the task return value', async () => {
  const symbol = Symbol();
  const val = await db.sequelize.transaction(async () => symbol);
  expect(val).toBe(symbol);
});

it('nests transactions', async () => {
  await db.transaction(async () => {
    await createUser(db, { id: ID1 });
    expect(await isUserPersisted(db, ID1)).toBe(true);

    await db.transaction(async () => {
      await createUser(db, { id: ID2 });
      expect(await isUserPersisted(db, ID1)).toBe(true);
      expect(await isUserPersisted(db, ID2)).toBe(true);
    });

    expect(await isUserPersisted(db, ID1)).toBe(true);
    expect(await isUserPersisted(db, ID2)).toBe(true);
  });
});

it('supports concurrent transactions', async () => {
  await Promise.all([
    db.transaction(async (t) => createUser(db, { id: ID1 })),
    db.transaction(async (t) => createUser(db, { id: ID2 })),
  ]);

  expect(await isUserPersisted(db, ID1)).toBe(true);
  expect(await isUserPersisted(db, ID2)).toBe(true);
});
