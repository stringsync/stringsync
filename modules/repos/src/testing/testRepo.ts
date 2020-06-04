import { Repo } from '../types';
import { RepoFactory, Cleanup } from './types';

export const testRepo = <T extends object>(repoFactory: RepoFactory<T>, cleanup: Cleanup<T>) => {
  let repo: Repo<T>;

  beforeEach(() => {
    repo = repoFactory();
  });

  afterEach(async () => {
    await cleanup(repo);
  });

  describe('all', () => {
    it('returns an empty array', async () => {
      const all = await repo.all();
      expect(all).toHaveLength(0);
    });
  });
};
