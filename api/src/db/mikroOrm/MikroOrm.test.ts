import { container } from '../../inversify.config';
import { buildRandNotation, buildRandTag, buildRandUser } from '../../testing';
import { randStr } from '../../util';
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

      db.em.persist(tag);
      await db.em.flush();

      const actualTag = await db.em.findOne(Tag, { name: 'foo' });
      expect(actualTag).not.toBeNull();
      expect(actualTag!.id).toBe(tag.id);
      expect(actualTag!.name).toBe(tag.name);
    });

    it('can delete tag', async () => {
      const tag = new Tag({ name: 'foo' });

      db.em.persist(tag);
      await db.em.flush();

      db.em.remove(tag);
      await db.em.flush();

      const actualTag = await db.em.findOne(Tag, { name: 'foo' });
      expect(actualTag).toBeNull();
    });

    it('can create taggings', async () => {
      const tag = new Tag(buildRandTag());
      const tagging = new Tagging();
      tag.taggings.add(tagging);

      db.em.persist(tag);
      await db.em.flush();

      const actualTagging = await db.em.findOne(Tagging, { tag });
      expect(actualTagging).not.toBeNull();
      expect(actualTagging!.id).toBe(tagging.id);
      expect(actualTagging!.tag.id).toBe(tag.id);
    });

    it('finds taggings by tagId', async () => {
      const tag = new Tag(buildRandTag());
      const tagging = new Tagging();
      tag.taggings.add(tagging);

      db.em.persist(tag);
      await db.em.flush();

      const actualTagging = await db.em.findOne(Tagging, { tagId: tag.id });
      expect(actualTagging).not.toBeNull();
      expect(actualTagging!.tagId).toBe(tag.id);
    });
  });

  describe('Notation', () => {
    it('can create notations', async () => {
      const notation = new Notation(buildRandNotation());
      const transcriber = new User(buildRandUser());
      notation.transcriber.set(transcriber);

      db.em.persist(notation);
      await db.em.flush();

      const actualNotation = await db.em.findOne(Notation, { id: notation.id });
      expect(actualNotation).not.toBeNull();
      expect(actualNotation!.id).toBe(notation.id);
      expect(actualNotation!.transcriber.id).toBe(transcriber.id);
      expect(actualNotation!.transcriberId).toBe(transcriber.id);

      const actualTranscriber = await db.em.findOne(User, { id: transcriber.id });
      expect(actualTranscriber).not.toBeNull();
      expect(actualTranscriber!.id).toBe(transcriber.id);
    });

    it('will not create notations without a transcriber', async () => {
      const notation = new Notation(buildRandNotation());

      db.em.persist(notation);
      await expect(db.em.flush()).rejects.toThrowError();
    });

    it('adds timestamps', async () => {
      const notation = new Notation(buildRandNotation());
      const transcriber = new User(buildRandUser());
      notation.transcriber.set(transcriber);

      db.em.persist(notation);
      await db.em.flush();

      const actualNotation = await db.em.findOne(Notation, { id: notation.id });
      expect(actualNotation).not.toBeNull();
      expect(actualNotation!.createdAt).toBe(notation.createdAt);
      expect(notation.createdAt).not.toBeNull();
      expect(notation.updatedAt).not.toBeNull();
      expect(notation.createdAt).toBe(notation.updatedAt);
      expect(actualNotation!.createdAt).not.toBeNull();
      expect(actualNotation!.updatedAt).not.toBeNull();
      expect(actualNotation!.createdAt).toBe(actualNotation!.updatedAt);
    });

    it('can update a notation', async () => {
      const notation = new Notation(buildRandNotation());
      const transcriber = new User(buildRandUser());
      notation.transcriber.set(transcriber);

      db.em.persist(notation);
      await db.em.flush();

      const thumbnailUrl = `https://example.com/${randStr(8)}.jpg`;
      notation.thumbnailUrl = thumbnailUrl;

      db.em.persist(notation);
      await db.em.flush();

      const actualNotation = await db.em.findOne(Notation, { id: notation.id });
      expect(actualNotation).not.toBeNull();
      expect(actualNotation!.thumbnailUrl).toBe(thumbnailUrl);
      expect(actualNotation!.updatedAt).toBeAfter(actualNotation!.createdAt);
    });
  });

  describe('User', () => {
    it('can create users', async () => {
      const user = new User(buildRandUser());

      db.em.persist(user);
      await db.em.flush();

      const actualUser = await db.em.findOne(User, { id: user.id });
      expect(actualUser).not.toBeNull();
      expect(actualUser!.id).toBe(user.id);
    });

    it('can create a user with notations', async () => {
      const user = new User(buildRandUser());
      const notation1 = new Notation(buildRandNotation());
      const notation2 = new Notation(buildRandNotation());
      user.notations.add(notation1, notation2);

      db.em.persist(user);
      await db.em.flush();

      const actualUser = await db.em.findOne(User, { id: user.id }, ['notations']);
      expect(actualUser).not.toBeNull();
      expect(actualUser!.notations.isInitialized()).toBeTrue();
      expect(actualUser!.notations.contains(notation1)).toBeTrue();

      const actualNotations = await db.em.find(Notation, { transcriberId: user.id });
      expect(actualNotations).toHaveLength(2);
      expect(actualNotations[0].transcriberId).toBe(user.id);
      expect(actualNotations[1].transcriberId).toBe(user.id);
    });
  });
});
