import { isPlainObject } from 'lodash';
import { User } from '../domain';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { createRandUsers } from '../testing';
import { ctor, randStr } from '../util';
import { SequelizeUserLoader } from './sequelize';
import { UserLoader } from './types';

const ORIGINAL_USER_LOADER = ctor(container.get<UserLoader>(TYPES.UserLoader));

describe.each([['SequelizeUserLoader', SequelizeUserLoader]])('%s', (name, Ctor) => {
  let userLoader: UserLoader;

  let user1: User;
  let user2: User;

  beforeAll(() => {
    container.rebind<UserLoader>(TYPES.UserLoader).to(Ctor);
  });

  beforeEach(async () => {
    userLoader = container.get<UserLoader>(TYPES.UserLoader);
    [user1, user2] = await createRandUsers(2);
  });

  afterAll(() => {
    container.rebind<UserLoader>(TYPES.UserLoader).to(ORIGINAL_USER_LOADER);
  });

  describe('findById', () => {
    it('finds a user by id', async () => {
      const user = await userLoader.findById(user1.id);
      expect(user).not.toBeNull();
      expect(user!.id).toBe(user1.id);
    });

    it('returns null for a user that does not exist', async () => {
      const user = await userLoader.findById(randStr(10));
      expect(user).toBeNull();
    });

    it('returns null for an empty id', async () => {
      const user = await userLoader.findById('');
      expect(user).toBeNull();
    });

    it('returns a plain object', async () => {
      const user = await userLoader.findById(user1.id);
      expect(isPlainObject(user)).toBe(true);
    });
  });
});
