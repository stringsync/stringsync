import { Repo } from '../types';
import { TestRepoConfig } from './types';
import { omit } from 'lodash';

const withoutUpdatedAt = (objs: any[]) => objs.map((obj) => omit(obj, 'updatedAt'));

export const testRepo = <T extends object>(config: TestRepoConfig<T>) => {
  const { repoFactory, entityFactory, cleanup } = config;
  let repo: Repo<T>;

  beforeEach(() => {
    repo = repoFactory();
  });

  afterEach(async () => {
    await cleanup(repo);
  });

  describe('all', () => {
    it('returns an empty array initially', async () => {
      const entities = await repo.all();
      expect(entities).toHaveLength(0);
    });

    it('returns all entities', async () => {
      const entity1 = entityFactory();
      const entity2 = entityFactory();
      await repo.create(entity1);
      await repo.create(entity2);

      const entities = await repo.all();

      const expected = withoutUpdatedAt([entity1, entity2]).sort();
      const actual = withoutUpdatedAt(entities).sort();
      expect(actual).toStrictEqual(expected);
    });
  });
};
