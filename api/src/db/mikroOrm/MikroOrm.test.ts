import { container } from '../../inversify.config';
import { Tag, Tagging } from './entities';
import { MikroOrmDb } from './MikroOrmDb';

/**
 * These test are meant to confirm the understanding of the MikroOrm library.
 * They are not meant to be exhaustive.
 */
describe('mikro-orm', () => {
  const id = Symbol('MikroOrmDb');
  let db: MikroOrmDb;

  beforeEach(async () => {
    container
      .bind<MikroOrmDb>(id)
      .to(MikroOrmDb)
      .inSingletonScope();
    db = container.get(id);
    await db.init();
  });

  afterEach(async () => {
    await db.cleanup();
    await db.closeConnection();
    container.unbind(id);
  });

  describe('TagEntity', () => {
    it('can create tag entities', async () => {
      const tag = new Tag({ name: 'foo' });
      db.orm.em.persist(tag);
      await db.orm.em.flush();

      const actualTag = await db.orm.em.findOne(Tag, { name: 'foo' });
      expect(actualTag).not.toBeNull();
      expect(actualTag!.id).toBe(tag.id);
      expect(actualTag!.name).toBe(tag.name);
    });

    it('can delete tag entities', async () => {
      const tag = new Tag({ name: 'foo' });
      db.orm.em.persist(tag);
      await db.orm.em.flush();

      db.orm.em.remove(tag);
      await db.orm.em.flush();

      const actualTag = await db.orm.em.findOne(Tag, { name: 'foo' });
      expect(actualTag).toBeNull();
    });

    it('can create taggings', async () => {
      const tag = new Tag({ name: 'foo' });
      const tagging = new Tagging();
      tag.taggings.add(tagging);
      db.orm.em.persist(tag);
      await db.orm.em.flush();

      const actualTagging = await db.orm.em.findOne(Tagging, { tag });
      expect(actualTagging).not.toBeNull();
      expect(actualTagging!.id).toBe(tagging.id);
      expect(actualTagging!.tag.id).toBe(tag.id);
    });

    it('finds taggings by tagId', async () => {
      const tag = new Tag({ name: 'foo' });
      const tagging = new Tagging();
      tag.taggings.add(tagging);
      db.orm.em.persist(tag);
      await db.orm.em.flush();

      const actualTagging = await db.orm.em.findOne(Tagging, { tagId: tag.id });
      expect(actualTagging).not.toBeNull();
      expect(actualTagging!.tagId).toBe(tag.id);
    });
  });
});
