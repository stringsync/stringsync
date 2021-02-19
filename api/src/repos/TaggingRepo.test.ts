import { isPlainObject } from 'lodash';
import { Notation, Tag, Tagging, User } from '../domain';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { EntityBuilder } from '../testing';
import { ctor, randStr } from '../util';
import { SequelizeTaggingRepo } from './sequelize';
import { NotationRepo, TaggingRepo, TagRepo, UserRepo } from './types';

const ORIGINAL_TAGGING_REPO = ctor(container.get<TaggingRepo>(TYPES.TaggingRepo));

describe.each([['SequelizeTaggingRepo', SequelizeTaggingRepo]])('%s', (name, Ctor) => {
  let taggingRepo: TaggingRepo;

  let user1: User;
  let user2: User;

  let notation1: Notation;
  let notation2: Notation;

  let tag1: Tag;
  let tag2: Tag;

  let tagging1: Tagging;
  let tagging2: Tagging;

  beforeAll(() => {
    container.rebind<TaggingRepo>(TYPES.TaggingRepo).to(Ctor);
  });

  beforeEach(() => {
    taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
  });

  afterAll(() => {
    container.rebind<TaggingRepo>(TYPES.TaggingRepo).to(ORIGINAL_TAGGING_REPO);
  });

  beforeEach(async () => {
    const userRepo = container.get<UserRepo>(TYPES.UserRepo);
    [user1, user2] = await userRepo.bulkCreate([EntityBuilder.buildRandUser(), EntityBuilder.buildRandUser()]);

    const notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
    [notation1, notation2] = await notationRepo.bulkCreate([
      EntityBuilder.buildRandNotation({ transcriberId: user1.id }),
      EntityBuilder.buildRandNotation({ transcriberId: user2.id }),
    ]);

    const tagRepo = container.get<TagRepo>(TYPES.TagRepo);
    [tag1, tag2] = await tagRepo.bulkCreate([EntityBuilder.buildRandTag(), EntityBuilder.buildRandTag()]);

    [tagging1, tagging2] = await taggingRepo.bulkCreate([
      EntityBuilder.buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
      EntityBuilder.buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
      EntityBuilder.buildRandTagging({ notationId: notation2.id, tagId: tag1.id }),
    ]);
  });

  describe('count', () => {
    it('counts the number of taggings', async () => {
      const count = await taggingRepo.count();
      expect(count).toBe(3);
    });
  });

  describe('create', () => {
    it('creates a tagging record', async () => {
      const countBefore = await taggingRepo.count();
      await taggingRepo.create(EntityBuilder.buildRandTagging({ notationId: notation2.id, tagId: tag2.id }));
      const countAfter = await taggingRepo.count();

      expect(countAfter).toBe(countBefore + 1);
    });

    it('creates a findable tagging record', async () => {
      const { id } = await taggingRepo.create(
        EntityBuilder.buildRandTagging({ notationId: notation2.id, tagId: tag2.id })
      );
      const tagging = await taggingRepo.find(id);

      expect(tagging).not.toBeNull();
      expect(tagging!.id).toBe(id);
    });

    it('returns a plain object', async () => {
      const tagging = await taggingRepo.create(
        EntityBuilder.buildRandTagging({ notationId: notation2.id, tagId: tag2.id })
      );

      expect(isPlainObject(tagging)).toBe(true);
    });

    it('disallows duplicate ids', async () => {
      const tagging = EntityBuilder.buildRandTagging({ id: randStr(8), notationId: notation2.id, tagId: tag2.id });

      await expect(taggingRepo.create(tagging)).resolves.not.toThrow();
      await expect(taggingRepo.create(tagging)).rejects.toThrow();
    });
  });

  describe('find', () => {
    it('returns the tagging matching the id', async () => {
      const tagging = await taggingRepo.find(tagging1.id);

      expect(tagging).not.toBeNull();
      expect(tagging!.id).toBe(tagging1.id);
    });

    it('returns a plain object', async () => {
      const tagging = await taggingRepo.find(tagging1.id);

      expect(isPlainObject(tagging)).toBe(true);
    });

    it('returns null when no user found', async () => {
      const tagging = await taggingRepo.find('id');

      expect(tagging).toBeNull();
    });
  });

  describe('update', () => {
    it('updates a tagging', async () => {
      const tagging = await taggingRepo.update(tagging2.id, { notationId: notation1.id });

      expect(tagging.notationId).toBe(notation1.id);
    });

    it('returns a plain object', async () => {
      const tagging = await taggingRepo.update(tagging2.id, { notationId: notation1.id });

      expect(isPlainObject(tagging)).toBe(true);
    });
  });
});
