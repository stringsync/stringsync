import { randStr } from '@stringsync/common';
import { Container, useTestContainer } from '@stringsync/di';
import { EntityBuilder, User } from '@stringsync/domain';
import { isPlainObject } from 'lodash';
import { REPOS } from '../../REPOS';
import { REPOS_TYPES } from '../../REPOS_TYPES';
import { UserRepo } from '../../types';
import { UserSequelizeLoader } from './UserSequelizeLoader';
import { UserSequelizeRepo } from './UserSequelizeRepo';

const TYPES = { ...REPOS_TYPES };

describe('UserSequelizeLoader', () => {
  const ref = useTestContainer(REPOS);

  let container: Container;

  let userLoader: UserSequelizeLoader;
  let userRepo: UserSequelizeRepo;

  let user1: User;
  let user2: User;

  beforeEach(() => {
    container = ref.container;
    container.rebind<UserSequelizeLoader>(TYPES.UserLoader).to(UserSequelizeLoader);
  });

  beforeEach(async () => {
    userLoader = container.get<UserSequelizeLoader>(TYPES.UserLoader);
    userRepo = container.get<UserRepo>(TYPES.UserRepo);
    [user1, user2] = await userRepo.bulkCreate([EntityBuilder.buildRandUser(), EntityBuilder.buildRandUser()]);
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

    it('returns a plain object', async () => {
      const user = await userLoader.findById(user1.id);
      expect(isPlainObject(user)).toBe(true);
    });
  });
});
