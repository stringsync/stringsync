import { LoadStrategy, Reference } from '@mikro-orm/core';
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
  let executeQuerySpy: jest.SpyInstance;

  const withNumQueries = async <T>(task: () => Promise<T>): Promise<{ numQueries: number; result: T }> => {
    const numQueries1 = executeQuerySpy.mock.calls.length;
    const result = await task();
    const numQueries2 = executeQuerySpy.mock.calls.length;
    const numQueries = numQueries2 - numQueries1;
    return { numQueries, result };
  };

  beforeEach(async () => {
    container
      .bind<MikroORMDb>(id)
      .to(MikroORMDb)
      .inSingletonScope();

    db = container.get(id);

    await db.init();

    const connection = db.orm.em.getConnection();
    // executeQuery is protected
    // https://github.com/mikro-orm/mikro-orm/blob/44998383b21a3aef943a922a3e75426369178f35/packages/core/src/connections/Connection.ts#L95
    executeQuerySpy = jest.spyOn(connection as any, 'executeQuery');
  });

  afterEach(async () => {
    await db.cleanup();
    await db.closeConnection();
    container.unbind(id);
  });

  describe('TagEntity', () => {
    it('can create a tag', async () => {
      const tag = new TagEntity({ name: 'foo' });

      db.em.persist(tag);
      await db.em.flush();

      const actualTag = await db.em.findOne(TagEntity, { name: 'foo' });
      expect(actualTag).not.toBeNull();
      expect(actualTag!.id).toBe(tag.id);
      expect(actualTag!.name).toBe(tag.name);
    });

    it('can delete a tag', async () => {
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
      const user = new UserEntity(buildRandUser());
      const notation = new NotationEntity(buildRandNotation());
      const tagging = new TaggingEntity();

      notation.transcriber.set(user);
      tag.taggings.add(tagging);
      tagging.notation = Reference.create(notation);

      db.em.persist([notation, tag]);
      await db.em.flush();

      const actualTagging = await db.em.findOne(TaggingEntity, { tag });
      expect(actualTagging).not.toBeNull();
      expect(actualTagging!.id).toBe(tagging.id);
      expect(actualTagging!.tag.id).toBe(tag.id);
    });

    it('finds taggings by tagId', async () => {
      const tag = new TagEntity(buildRandTag());
      const user = new UserEntity(buildRandUser());
      const notation = new NotationEntity(buildRandNotation());
      const tagging = new TaggingEntity();

      notation.transcriber.set(user);
      tag.taggings.add(tagging);
      tagging.notation = Reference.create(notation);

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

  describe('many to many relationships', () => {
    let user: UserEntity;

    let rock: TagEntity;
    let jazz: TagEntity;
    let tag: TagEntity;

    let rockJazzNotation: NotationEntity;
    let jazzNotation: NotationEntity;
    let rockNotation: NotationEntity;
    let countryNotation: NotationEntity;

    beforeEach(async () => {
      user = new UserEntity(buildRandUser());

      rock = new TagEntity(buildRandTag({ name: 'rock' }));
      jazz = new TagEntity(buildRandTag({ name: 'jazz' }));
      tag = new TagEntity(buildRandTag({ name: 'country' }));

      rockJazzNotation = new NotationEntity(buildRandNotation());
      jazzNotation = new NotationEntity(buildRandNotation());
      rockNotation = new NotationEntity(buildRandNotation());
      countryNotation = new NotationEntity(buildRandNotation());

      rockJazzNotation.transcriber.set(user);
      jazzNotation.transcriber.set(user);
      rockNotation.transcriber.set(user);
      countryNotation.transcriber.set(user);

      rockJazzNotation.tags.add(rock, jazz);
      jazzNotation.tags.add(jazz);
      rockNotation.tags.add(rock);
      countryNotation.tags.add(tag);

      db.em.persist(user);
      db.em.persist([rock, jazz]);
      db.em.persist([rockJazzNotation, jazzNotation, rockNotation, countryNotation]);
      await db.em.flush();
      db.em.clear();
    });

    it('issues a query if relation is not initialized', async () => {
      const notations = await db.em.find(NotationEntity, { tags: [rock, jazz] });

      const notationIds = notations.map((notation) => notation.id);
      expect(notationIds).toIncludeAllMembers([rockJazzNotation.id, jazzNotation.id, rockNotation.id]);

      expect(notations[0].tags.isInitialized(true)).toBeFalse();
      expect(notations[1].tags.isInitialized(true)).toBeFalse();
      expect(notations[2].tags.isInitialized(true)).toBeFalse();

      const { numQueries: numQueriesForTags } = await withNumQueries(() => {
        return Promise.all([
          notations[0].tags.loadItems(),
          notations[1].tags.loadItems(),
          notations[2].tags.loadItems(),
        ]);
      });
      expect(numQueriesForTags).toBe(3);

      expect(notations[0].tags.isInitialized(true)).toBeTrue();
      expect(notations[1].tags.isInitialized(true)).toBeTrue();
      expect(notations[2].tags.isInitialized(true)).toBeTrue();

      expect(notations[0].taggings.isInitialized(true)).toBeFalse();
      expect(notations[1].taggings.isInitialized(true)).toBeFalse();
      expect(notations[2].taggings.isInitialized(true)).toBeFalse();

      const { numQueries: numQueriesForTaggings } = await withNumQueries(() => {
        return Promise.all([
          notations[0].taggings.loadItems(),
          notations[1].taggings.loadItems(),
          notations[2].taggings.loadItems(),
        ]);
      });
      expect(numQueriesForTaggings).toBe(3);

      expect(notations[0].taggings.isInitialized(true)).toBeTrue();
      expect(notations[1].taggings.isInitialized(true)).toBeTrue();
      expect(notations[2].taggings.isInitialized(true)).toBeTrue();
    });

    it('does not issue a query if relation is initialized', async () => {
      const notations = await db.em.find(
        NotationEntity,
        { tags: [rock, jazz] },
        { populate: { tags: LoadStrategy.JOINED } }
      );

      const notationIds = notations.map((notation) => notation.id);
      expect(notationIds).toIncludeAllMembers([rockJazzNotation.id, jazzNotation.id, rockNotation.id]);

      expect(notations[0].tags.isInitialized(true)).toBeTrue();
      expect(notations[1].tags.isInitialized(true)).toBeTrue();
      expect(notations[2].tags.isInitialized(true)).toBeTrue();

      expect(notations[0].taggings.isInitialized(true)).toBeFalse();
      expect(notations[1].taggings.isInitialized(true)).toBeFalse();
      expect(notations[2].taggings.isInitialized(true)).toBeFalse();

      const { numQueries: numQueriesForTaggings } = await withNumQueries(() => {
        return Promise.all([
          notations[0].tags.loadItems(),
          notations[1].tags.loadItems(),
          notations[2].tags.loadItems(),
        ]);
      });
      expect(numQueriesForTaggings).toBe(0);

      expect(notations[0].tags.isInitialized(true)).toBeTrue();
      expect(notations[1].tags.isInitialized(true)).toBeTrue();
      expect(notations[2].tags.isInitialized(true)).toBeTrue();

      expect(notations[0].taggings.isInitialized(true)).toBeFalse();
      expect(notations[1].taggings.isInitialized(true)).toBeFalse();
      expect(notations[2].taggings.isInitialized(true)).toBeFalse();
    });

    it('can query all notations by tag id', async () => {
      const { numQueries, result: notations } = await withNumQueries(() =>
        db.em.find(NotationEntity, { tags: [rock, jazz] })
      );

      expect(numQueries).toBe(1);

      const notationIds = notations.map((notation) => notation.id);
      expect(notationIds).toIncludeAllMembers([rockJazzNotation.id, jazzNotation.id, rockNotation.id]);

      expect(notations[0].taggings.isInitialized(true)).toBeFalse();
      expect(notations[1].taggings.isInitialized(true)).toBeFalse();
      expect(notations[2].taggings.isInitialized(true)).toBeFalse();

      expect(notations[0].tags.isInitialized(true)).toBeFalse();
      expect(notations[1].tags.isInitialized(true)).toBeFalse();
      expect(notations[2].tags.isInitialized(true)).toBeFalse();
    });

    it('can query all notations by tag id and load distant relations', async () => {
      const { numQueries, result: notations } = await withNumQueries(() =>
        db.em.find(NotationEntity, { tags: [rock, jazz] }, { populate: { tags: LoadStrategy.JOINED } })
      );

      expect(numQueries).toBe(1);

      const notationIds = notations.map((notation) => notation.id);
      expect(notationIds).toIncludeAllMembers([rockJazzNotation.id, jazzNotation.id, rockNotation.id]);

      expect(notations[0].taggings.isInitialized(true)).toBeFalse();
      expect(notations[1].taggings.isInitialized(true)).toBeFalse();
      expect(notations[2].taggings.isInitialized(true)).toBeFalse();

      expect(notations[0].tags.isInitialized(true)).toBeTrue();
      expect(notations[1].tags.isInitialized(true)).toBeTrue();
      expect(notations[2].tags.isInitialized(true)).toBeTrue();
    });

    it('can query all notations by tag id and load distant relations and join table relations', async () => {
      const { numQueries, result: notations } = await withNumQueries(() =>
        db.em.find(
          NotationEntity,
          { tags: [rock, jazz] },
          { populate: { tags: LoadStrategy.JOINED, taggings: LoadStrategy.JOINED } }
        )
      );

      expect(numQueries).toBe(1);

      const notationIds = notations.map((notation) => notation.id);
      expect(notationIds).toIncludeAllMembers([rockJazzNotation.id, jazzNotation.id, rockNotation.id]);

      expect(notations[0].taggings.isInitialized(true)).toBeTrue();
      expect(notations[1].taggings.isInitialized(true)).toBeTrue();
      expect(notations[2].taggings.isInitialized(true)).toBeTrue();

      expect(notations[0].tags.isInitialized(true)).toBeTrue();
      expect(notations[1].tags.isInitialized(true)).toBeTrue();
      expect(notations[2].tags.isInitialized(true)).toBeTrue();
    });

    it('can query all notations by tag id and load join table relations', async () => {
      const { numQueries, result: notations } = await withNumQueries(() =>
        db.em.find(
          NotationEntity,
          { tags: [rock, jazz] },
          {
            populate: {
              taggings: LoadStrategy.SELECT_IN,
            },
          }
        )
      );

      expect(numQueries).toBe(2);

      const notationIds = notations.map((notation) => notation.id);
      expect(notationIds).toIncludeAllMembers([rockJazzNotation.id, jazzNotation.id, rockNotation.id]);

      expect(notations[0].taggings.isInitialized(true)).toBeTrue();
      expect(notations[1].taggings.isInitialized(true)).toBeTrue();
      expect(notations[2].taggings.isInitialized(true)).toBeTrue();

      expect(notations[0].tags.isInitialized(true)).toBeFalse();
      expect(notations[1].tags.isInitialized(true)).toBeFalse();
      expect(notations[2].tags.isInitialized(true)).toBeFalse();
    });

    it('caches SELECT_IN queries', async () => {
      const getNotations = () => {
        return db.em.find(
          NotationEntity,
          { tags: [rock, jazz] },
          {
            populate: {
              tags: LoadStrategy.SELECT_IN,
              taggings: LoadStrategy.SELECT_IN,
            },
          }
        );
      };

      await getNotations();
      const { numQueries, result: notations } = await withNumQueries(getNotations);

      expect(numQueries).toBe(1);

      const notationIds = notations.map((notation) => notation.id);
      expect(notationIds).toIncludeAllMembers([rockJazzNotation.id, jazzNotation.id, rockNotation.id]);

      expect(notations[0].taggings.isInitialized(true)).toBeTrue();
      expect(notations[1].taggings.isInitialized(true)).toBeTrue();
      expect(notations[2].taggings.isInitialized(true)).toBeTrue();

      expect(notations[0].tags.isInitialized(true)).toBeTrue();
      expect(notations[1].tags.isInitialized(true)).toBeTrue();
      expect(notations[2].tags.isInitialized(true)).toBeTrue();
    });
  });
});
