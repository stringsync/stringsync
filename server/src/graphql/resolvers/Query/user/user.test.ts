import { resolver } from './user';
import { tmpResolverCtx, createUser, randStr } from '../../../../testing';

describe('resolver', () => {
  it('returns the user matching the id', () => {
    const id = randStr(10);
    const input = { input: { id } };

    return tmpResolverCtx(async (ctx, info) => {
      await createUser(ctx.db, { id });

      const user = await resolver(undefined, input, ctx, info);

      expect(user).not.toBeNull();
      expect(user!.id).toBe(id);
    });
  });
});
