import { TestRepoConfig } from './types';
import { testRepo } from './testRepo';
import { UserRepo } from '../types';
import { User, buildUser } from '@stringsync/domain';

export const testUserRepo = (config: TestRepoConfig<User, UserRepo>) => {
  testRepo(config);

  describe('UserRepo', () => {
    const { repoFactory, entityFactory, cleanup } = config;

    let repo: UserRepo;

    beforeEach(async () => {
      repo = await repoFactory();
    });

    afterEach(async () => {
      await cleanup(repo);
    });

    describe('findByUsernameOrEmail', () => {
      it('searches users by username', async () => {
        const user = await repo.create(buildUser());
        const foundUser = await repo.findByUsernameOrEmail(user.username);
        expect(foundUser).toStrictEqual(user);
      });

      it('searches users by email', async () => {
        const user = await repo.create(buildUser());
        const foundUser = await repo.findByUsernameOrEmail(user.email);
        expect(foundUser).toStrictEqual(user);
      });
    });
  });
};
