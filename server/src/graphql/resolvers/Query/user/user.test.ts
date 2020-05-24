import { resolver } from './user';
import { Provider, createUser, randStr } from '../../../../testing';

it('returns the user matching the id', async () => {
  await Provider.run({}, async (p) => {
    const rctx = p.rctx;
    const info = p.info;
    const id = randStr(10);
    const input = { input: { id } };

    await createUser(rctx.db, { id });

    const user = await resolver(undefined, input, rctx, info);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(id);
  });
});
