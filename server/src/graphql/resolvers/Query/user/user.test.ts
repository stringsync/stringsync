import { resolver } from './user';
import { Provider, createUser, randStr } from '../../../../testing';

describe('resolver', () => {
  it('returns the user matching the id', async () => {
    await Provider.run({}, async (p) => {
      const ctx = p.rctx;
      const info = p.info;
      const id = randStr(10);
      const input = { input: { id } };

      await createUser(ctx.db, { id });

      const user = await resolver(undefined, input, ctx, info);

      expect(user).not.toBeNull();
      expect(user!.id).toBe(id);
    });
  });
});
