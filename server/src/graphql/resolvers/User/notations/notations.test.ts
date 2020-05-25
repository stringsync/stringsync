import { resolver } from './notations';
import { Provider, randStr } from '../../../../testing';
import { User } from '../../../../common';

const USER: User = {
  id: randStr(10),
  confirmedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: randStr(10),
  role: 'student',
  username: randStr(10),
};

it('returns the user notations', async () => {
  Provider.run({ src: USER }, async (p) => {
    const { src, args, rctx, info } = p;

    const value = await resolver(src, args, rctx, info);

    expect(value).toStrictEqual([{ id: USER.id }]);
  });
});
