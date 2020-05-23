import { Db } from './types';
import { connectToDb } from './connectToDb';
import { getConfig } from '../../config';
import { getLogger } from '../../util/logger';
import { createUser, randStr } from '../../testing';
import { ForcedRollback } from './ForcedRollback';
import { TRANSACTION_NAMESPACE } from './constants';
import { uniq } from 'lodash';

let db: Db;
const config = getConfig(process.env);
const logger = getLogger();

beforeEach(() => {
  db = connectToDb(config, logger);
});

afterEach(async () => {
  await db.sequelize.close();
});

const isUserPersisted = async (db: Db, id: string): Promise<boolean> => {
  const user = await db.User.findByPk(id);
  return user !== null;
};

it('sets the namespace within the callback', async () => {
  await db.transaction(async (t) => {
    const nst = db.namespace.get(TRANSACTION_NAMESPACE);
    expect(nst).toBeDefined();
    expect(t).toBe(nst);
  });
});

it('unsets the namespace outside the callback', async () => {
  await db.transaction(async () => {});
  const nst = db.namespace.get(TRANSACTION_NAMESPACE);
  expect(nst).toBeUndefined();
});

it('commits when no error thrown', async () => {
  const id = randStr(10);

  await db.transaction(async () => {
    await createUser(db, { id });
    expect(await isUserPersisted(db, id)).toBe(true);
  });

  expect(await isUserPersisted(db, id)).toBe(true);
});

it('rolls back when error thrown', async () => {
  const id = randStr(10);

  try {
    await db.transaction(async () => {
      await createUser(db, { id });
      expect(await isUserPersisted(db, id)).toBe(true);
      throw new ForcedRollback();
    });
  } catch (e) {
    expect(e).toBeInstanceOf(ForcedRollback);
  }

  expect(await isUserPersisted(db, id)).toBe(false);
});

it('returns the task return value', async () => {
  const symbol = Symbol(randStr(5));
  const val = await db.sequelize.transaction(async () => symbol);
  expect(val).toBe(symbol);
});

it('nests transactions', async () => {
  await db.transaction(async (t1) => {
    await db.transaction(async (t2) => {
      expect(t1).toBe(t2);
    });
  });
});

it('supports concurrent transactions', async () => {
  const users = await Promise.all([
    db.transaction(async (t) => createUser(db)),
    db.transaction(async (t) => createUser(db)),
    db.transaction(async (t) => createUser(db)),
  ]);

  const ids = users.map((user) => user.id);
  expect(uniq(ids)).toHaveLength(3);

  for (const id of ids) {
    expect(await isUserPersisted(db, id)).toBe(true);
  }
});
