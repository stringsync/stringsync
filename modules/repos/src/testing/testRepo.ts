import { Repo } from '../types';
import { TestRepoConfig } from './types';

export const testRepo = <T extends object>(config: TestRepoConfig<T>) => {
  describe('Repo', () => {
    const { repoFactory, entityFactory, cleanup } = config;

    const ENTITY_METADATA = {
      hasUpdatedAt: 'updatedAt' in entityFactory(),
    };

    let repo: Repo<T>;

    beforeEach(async () => {
      repo = await repoFactory();
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

      it('throws an error if the entity already exists', async () => {
        const entity = await repo.create(entityFactory());

        await expect(repo.create(entity)).rejects.toThrow();
      });
    });

    describe('update', () => {
      const perturbEntity = (entity: T, repo: Repo<T>): T => ({
        ...entityFactory(),
        [repo.idName]: repo.getId(entity),
      });

      it('updates an entity', async () => {
        const entity = await repo.create(entityFactory());
        const perturbedEntity = perturbEntity(entity, repo);

        await repo.update(perturbedEntity);
        const id = repo.getId(entity);
        const updatedEntity = await repo.find(id);

        const expected = { ...perturbedEntity };
        const actual = { ...updatedEntity };

        if (ENTITY_METADATA.hasUpdatedAt) {
          delete (expected as any).updatedAt;
          delete (actual as any).updatedAt;
        }

        expect(expected).toStrictEqual(actual);
      });

      it('updates updatedAt', async () => {
        if (!ENTITY_METADATA.hasUpdatedAt) {
          return;
        }

        const past = new Date();
        past.setDate(past.getDate() - 1);
        const attrs: any = { updatedAt: past };

        const entity = await repo.create(entityFactory(attrs));
        const perturbedEntity = perturbEntity(entity, repo);

        await repo.update(perturbedEntity);
        const id = repo.getId(entity);
        const updatedEntity = await repo.find(id);

        const before = (entity as any).updatedAt.getTime();
        const after = (updatedEntity as any).updatedAt.getTime();
        expect(after).toBeGreaterThan(before);
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

        expect(entities).toHaveLength(2);
        expect(entities.sort()).toStrictEqual([entity1, entity2].sort());
      });
    });

    describe('destroyAll', () => {
      it('destroys all entites from the underlying store', async () => {
        await repo.create(entityFactory());
        await repo.create(entityFactory());

        await repo.destroyAll();

        const entities = await repo.findAll();
        expect(entities).toHaveLength(0);
      });
    });
  });
};
