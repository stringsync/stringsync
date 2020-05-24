import { resolver } from './user';
import { tmpResolverCtx, createUser, randStr } from '../../../../testing';

it('returns the user matching the id', () => {
  const id = randStr(10);

  return tmpResolverCtx(async (ctx, info) => {
    await createUser(ctx.db, { id });

    const user = await resolver(undefined, { input: { id } }, ctx, info);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(id);
  });
});
