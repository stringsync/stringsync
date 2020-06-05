import { Repo } from '../types';
import { TestRepoConfig } from './types';
import { omit } from 'lodash';

export const testRepo = <T extends object>(config: TestRepoConfig<T>) => {
  const { repoFactory, entityFactory, cleanup } = config;
  let repo: Repo<T>;

  beforeEach(() => {
    repo = repoFactory();
  });

  afterEach(async () => {
    await cleanup(repo);
  });

  describe('getId', () => {
    it('returns a string identifier', async () => {
      const entity = await repo.create(entityFactory());

      const id = repo.getId(entity);

      expect(Object.values(entity).includes(id)).toBe(true);
    });
  });

  describe('create', () => {
    it('creates an entity', async () => {
      const createdEntity = await repo.create(entityFactory());

      const id = repo.getId(createdEntity);
      const refetchedEntity = await repo.find(id);

      expect(refetchedEntity).toStrictEqual(createdEntity);
    });
  });

  describe('findAll', () => {
    it('returns an empty array initially', async () => {
      const entities = await repo.findAll();
      expect(entities).toHaveLength(0);
    });

    it('returns all entities', async () => {
      const entity1 = await repo.create(entityFactory());
      const entity2 = await repo.create(entityFactory());

      const entities = await repo.findAll();

      expect(entities.sort()).toStrictEqual([entity1, entity2].sort());
    });
  });
};
