import { resolver } from './users';
import { Provider, randStr, buildUser } from '../../../../testing';

it('returns the users matching the ids', async () => {
  const id1 = randStr(10);
  const id2 = randStr(10);
  const id3 = randStr(10);

  await Provider.run({ args: { input: { ids: [id1, id2] } } }, async (p) => {
    const { gctx, src, args, rctx, info } = p;

    await gctx.db.User.bulkCreate([
      buildUser({ id: id1 }),
      buildUser({ id: id2 }),
      buildUser({ id: id3 }),
    ]);

    const users = await resolver(src, args, rctx, info);

    expect(users).toHaveLength(2);
    expect(users.map((user) => user.id).sort()).toStrictEqual(
      [id1, id2].sort()
    );
  });
});

it('returns all records if ids is null', async () => {
  const id1 = randStr(10);
  const id2 = randStr(10);
  const id3 = randStr(10);

  await Provider.run({ args: { input: { ids: null } } }, async (p) => {
    const { gctx, src, args, rctx, info } = p;

    await gctx.db.User.bulkCreate([
      buildUser({ id: id1 }),
      buildUser({ id: id2 }),
      buildUser({ id: id3 }),
    ]);

    const users = await resolver(src, args, rctx, info);

    expect(users).toHaveLength(3);
    expect(users.map((user) => user.id).sort()).toStrictEqual(
      [id1, id2, id3].sort()
    );
  });
});
