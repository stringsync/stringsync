import { Provider } from './Provider';
import { randStr } from './rand';
import { createUser } from './fixtures';
import { Config, getConfig } from '../config';
import { DeepPartial } from '../common';
import { connectToDb, TRANSACTION_NAMESPACE } from '../data/db';
import { getLogger } from '../util/logger';

it('commits data within the callback', async () => {
  const id = randStr(10);
  await Provider.run({}, async (p) => {
    const db = p.gctx.db;
    await createUser(db, { id });
    const user = await db.User.findByPk(id);
    expect(user).not.toBeNull();
    expect(user!.id).toBe(id);
  });
});

it('rolls back data outside the callback', async () => {
  const id = randStr(10);
  await Provider.run({}, async (p) => {
    const db = p.gctx.db;
    await createUser(db, { id });
  });

  const config = getConfig(process.env);
  const namespace = TRANSACTION_NAMESPACE;
  const logger = getLogger();
  const db = connectToDb(config, namespace, logger);

  const user = await db.User.findByPk(id);

  expect(user).toBeNull();
});

it('memoizes its properties', async () => {
  await Provider.run({}, (p) => {
    expect(p.gctx).toBe(p.gctx);
    expect(p.rctx).toBe(p.rctx);
    expect(p.config).toBe(p.config);
    expect(p.req).toBe(p.req);
    expect(p.res).toBe(p.res);
    expect(p.info).toBe(p.info);
  });
});

it('patches config', async () => {
  const role = randStr(10);
  const config: DeepPartial<Config> = { ROLE: role };
  await Provider.run({ config }, async (p) => {
    expect(p.config.ROLE).toBe(role);
    expect(p.req.sessionID).toBeUndefined();
  });
});

it('patches req', async () => {
  const sessionId = randStr(10);
  const sessionUserId = randStr(10);
  const req = {
    sessionID: sessionId,
    session: { user: { id: sessionUserId } },
  };
  await Provider.run({ req }, async (p) => {
    expect(p.req.sessionID).toBe(sessionId);
    expect(p.req.session.user.id).toBe(sessionUserId);
  });
});

it('patches res', async () => {
  const status = jest.fn().mockReturnThis();
  const res = { status };
  await Provider.run({ res }, async (p) => {
    const returnValue = p.res.status(500);
    expect(status).toBeCalled();
    expect(returnValue).toStrictEqual(res);
  });
});

it('patches info', async () => {
  const fieldName = randStr(10);
  const info = { fieldName };
  await Provider.run({ info }, async (p) => {
    expect(p.info.fieldName).toBe(fieldName);
  });
});

it('patches reqAt', async () => {
  const reqAt = new Date();
  await Provider.run({ reqAt }, async (p) => {
    expect(p.rctx.reqAt).toBe(reqAt);
  });
});
