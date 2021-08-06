import { container } from '../../inversify.config';
import { buildRandNotation, buildRandTag, buildRandUser } from '../../testing';
import { Tag, Tagging } from './entities';
import { Notation } from './entities/Notation';
import { User } from './entities/User';
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

  describe('Tag', () => {
    it('can create tag', async () => {
      const tag = new Tag({ name: 'foo' });

      db.orm.em.persist(tag);
      await db.orm.em.flush();

      const actualTag = await db.orm.em.findOne(Tag, { name: 'foo' });
      expect(actualTag).not.toBeNull();
      expect(actualTag!.id).toBe(tag.id);
      expect(actualTag!.name).toBe(tag.name);
    });

    it('can delete tag', async () => {
      const tag = new Tag({ name: 'foo' });

      db.orm.em.persist(tag);
      await db.orm.em.flush();

      db.orm.em.remove(tag);
      await db.orm.em.flush();

      const actualTag = await db.orm.em.findOne(Tag, { name: 'foo' });
      expect(actualTag).toBeNull();
    });

    it('can create taggings', async () => {
      const tag = new Tag(buildRandTag());
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
      const tag = new Tag(buildRandTag());
      const tagging = new Tagging();
      tag.taggings.add(tagging);

      db.orm.em.persist(tag);
      await db.orm.em.flush();

      const actualTagging = await db.orm.em.findOne(Tagging, { tagId: tag.id });
      expect(actualTagging).not.toBeNull();
      expect(actualTagging!.tagId).toBe(tag.id);
    });
  });

  describe('Notation', () => {
    it('can create notations', async () => {
      const notation = new Notation(buildRandNotation());
      const transcriber = new User(buildRandUser());
      notation.transcriber.set(transcriber);

      db.orm.em.persist(notation);
      await db.orm.em.flush();

      const actualNotation = await db.orm.em.findOne(Notation, { id: notation.id });
      expect(actualNotation).not.toBeNull();
      expect(actualNotation!.id).toBe(notation.id);
      expect(actualNotation!.transcriber.id).toBe(transcriber.id);
      expect(actualNotation!.transcriberId).toBe(transcriber.id);

      const actualTranscriber = await db.orm.em.findOne(User, { id: transcriber.id });
      expect(actualTranscriber).not.toBeNull();
      expect(actualTranscriber!.id).toBe(transcriber.id);
    });

    it('will not create notations without a transcriber', async () => {
      const notation = new Notation(buildRandNotation());

      db.orm.em.persist(notation);
      await expect(db.orm.em.flush()).rejects.toThrowError();
    });
  });

  describe('User', () => {
    it('can create users', async () => {
      const user = new User(buildRandUser());

      db.orm.em.persist(user);
      await db.orm.em.flush();

      const actualUser = await db.orm.em.findOne(User, { id: user.id });
      expect(actualUser).not.toBeNull();
      expect(actualUser!.id).toBe(user.id);
    });
  });
});
