import { container } from '../../inversify.config';
import { buildRandNotation, buildRandTag, buildRandUser } from '../../testing';
import { randStr } from '../../util';
import { TagEntity, TaggingEntity } from './entities';
import { NotationEntity } from './entities/NotationEntity';
import { UserEntity } from './entities/UserEntity';
import { MikroORMDb } from './MikroORMDb';

/**
 * These test are meant to confirm the understanding of the MikroOrm library.
 * They are not meant to be exhaustive.
 */
describe('mikro-orm', () => {
  const id = Symbol('MikroOrmDb');
  let db: MikroORMDb;

  beforeEach(async () => {
    container
      .bind<MikroORMDb>(id)
      .to(MikroORMDb)
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
    it('can create tag', async () => {
      const tag = new TagEntity({ name: 'foo' });

      db.em.persist(tag);
      await db.em.flush();

      const actualTag = await db.em.findOne(TagEntity, { name: 'foo' });
      expect(actualTag).not.toBeNull();
      expect(actualTag!.id).toBe(tag.id);
      expect(actualTag!.name).toBe(tag.name);
    });

    it('can delete tag', async () => {
      const tag = new TagEntity({ name: 'foo' });

      db.em.persist(tag);
      await db.em.flush();

      db.em.remove(tag);
      await db.em.flush();

      const actualTag = await db.em.findOne(TagEntity, { name: 'foo' });
      expect(actualTag).toBeNull();
    });

    it('can create taggings', async () => {
      const tag = new TagEntity(buildRandTag());
      const tagging = new TaggingEntity();
      tag.taggings.add(tagging);

      db.em.persist(tag);
      await db.em.flush();

      const actualTagging = await db.em.findOne(TaggingEntity, { tag });
      expect(actualTagging).not.toBeNull();
      expect(actualTagging!.id).toBe(tagging.id);
      expect(actualTagging!.tag.id).toBe(tag.id);
    });

    it('finds taggings by tagId', async () => {
      const tag = new TagEntity(buildRandTag());
      const tagging = new TaggingEntity();
      tag.taggings.add(tagging);

      db.em.persist(tag);
      await db.em.flush();

      const actualTagging = await db.em.findOne(TaggingEntity, { tagId: tag.id });
      expect(actualTagging).not.toBeNull();
      expect(actualTagging!.tagId).toBe(tag.id);
    });
  });

  describe('NotationEntity', () => {
    it('can create notations', async () => {
      const notation = new NotationEntity(buildRandNotation());
      const transcriber = new UserEntity(buildRandUser());
      notation.transcriber.set(transcriber);

      db.em.persist(notation);
      await db.em.flush();

      const actualNotation = await db.em.findOne(NotationEntity, { id: notation.id });
      expect(actualNotation).not.toBeNull();
      expect(actualNotation!.id).toBe(notation.id);
      expect(actualNotation!.transcriber.id).toBe(transcriber.id);
      expect(actualNotation!.transcriberId).toBe(transcriber.id);

      const actualTranscriber = await db.em.findOne(UserEntity, { id: transcriber.id });
      expect(actualTranscriber).not.toBeNull();
      expect(actualTranscriber!.id).toBe(transcriber.id);
    });

    it('will not create notations without a transcriber', async () => {
      const notation = new NotationEntity(buildRandNotation());

      db.em.persist(notation);
      await expect(db.em.flush()).rejects.toThrowError();
    });

    it('adds timestamps', async () => {
      const notation = new NotationEntity(buildRandNotation());
      const transcriber = new UserEntity(buildRandUser());
      notation.transcriber.set(transcriber);

      db.em.persist(notation);
      await db.em.flush();

      const actualNotation = await db.em.findOne(NotationEntity, { id: notation.id });
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
      const notation = new NotationEntity(buildRandNotation());
      const transcriber = new UserEntity(buildRandUser());
      notation.transcriber.set(transcriber);

      db.em.persist(notation);
      await db.em.flush();

      const thumbnailUrl = `https://example.com/${randStr(8)}.jpg`;
      notation.thumbnailUrl = thumbnailUrl;

      db.em.persist(notation);
      await db.em.flush();

      const actualNotation = await db.em.findOne(NotationEntity, { id: notation.id });
      expect(actualNotation).not.toBeNull();
      expect(actualNotation!.thumbnailUrl).toBe(thumbnailUrl);
      expect(actualNotation!.updatedAt).toBeAfter(actualNotation!.createdAt);
    });

    it('disallows creation with invalid transcribers', async () => {
      const notation = new NotationEntity(buildRandNotation());
      const transcriber = new UserEntity();
      notation.transcriber.set(transcriber);

      db.em.persist(notation);
      await expect(db.em.flush()).rejects.toThrowError();
    });
  });

  describe('UserEntity', () => {
    it('can create users', async () => {
      const user = new UserEntity(buildRandUser());

      db.em.persist(user);
      await db.em.flush();

      const actualUser = await db.em.findOne(UserEntity, { id: user.id });
      expect(actualUser).not.toBeNull();
      expect(actualUser!.id).toBe(user.id);
    });

    it('can create a user with notations', async () => {
      const user = new UserEntity(buildRandUser());
      const notation1 = new NotationEntity(buildRandNotation());
      const notation2 = new NotationEntity(buildRandNotation());
      user.notations.add(notation1, notation2);

      db.em.persist(user);
      await db.em.flush();

      const actualUser = await db.em.findOne(UserEntity, { id: user.id }, ['notations']);
      expect(actualUser).not.toBeNull();
      expect(actualUser!.notations.isInitialized()).toBeTrue();
      expect(actualUser!.notations.contains(notation1)).toBeTrue();

      const actualNotations = await db.em.find(NotationEntity, { transcriberId: user.id });
      expect(actualNotations).toHaveLength(2);
      expect(actualNotations[0].transcriberId).toBe(user.id);
      expect(actualNotations[1].transcriberId).toBe(user.id);
    });

    it('disallows empty names', async () => {
      const user = new UserEntity(buildRandUser({ username: '' }));
      db.em.persist(user);
      await expect(db.em.flush()).rejects.toThrowError();
    });
  });
});
