import { resolver } from './user';
import { Provider, createUser, randStr } from '../../../../testing';

it('returns the user matching the id', async () => {
  const id = randStr(10);

  await Provider.run({ args: { input: { id } } }, async (p) => {
    const { src, args, rctx, info } = p;

    await createUser(rctx.db, { id });

    const user = await resolver(src, args, rctx, info);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(id);
  });
});
