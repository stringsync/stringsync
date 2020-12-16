import { randStr } from '@stringsync/common';
import { Container, useTestContainer } from '@stringsync/di';
import { EntityBuilder, Notation, Tag, Tagging, User } from '@stringsync/domain';
import { isPlainObject } from 'lodash';
import { REPOS } from '../../REPOS';
import { REPOS_TYPES } from '../../REPOS_TYPES';
import { NotationSequelizeRepo } from '../notation';
import { TagSequelizeRepo } from '../tag';
import { UserSequelizeRepo } from '../user';
import { TaggingSequelizeRepo } from './TaggingSequelizeRepo';

const TYPES = { ...REPOS_TYPES };

describe('TaggingSequelizeRepo', () => {
  const ref = useTestContainer(REPOS);

  let container: Container;

  let taggingRepo: TaggingSequelizeRepo;

  let user1: User;
  let user2: User;

  let notation1: Notation;
  let notation2: Notation;

  let tag1: Tag;
  let tag2: Tag;

  let tagging1: Tagging;
  let tagging2: Tagging;

  beforeEach(() => {
    container = ref.container;
    container.rebind<TaggingSequelizeRepo>(TYPES.TaggingRepo).to(TaggingSequelizeRepo);
  });

  beforeEach(async () => {
    const userRepo = container.get<UserSequelizeRepo>(TYPES.UserRepo);
    [user1, user2] = await userRepo.bulkCreate([EntityBuilder.buildRandUser(), EntityBuilder.buildRandUser()]);

    const notationRepo = container.get<NotationSequelizeRepo>(TYPES.NotationRepo);
    [notation1, notation2] = await notationRepo.bulkCreate([
      EntityBuilder.buildRandNotation({ transcriberId: user1.id }),
      EntityBuilder.buildRandNotation({ transcriberId: user2.id }),
    ]);

    const tagRepo = container.get<TagSequelizeRepo>(TYPES.TagRepo);
    [tag1, tag2] = await tagRepo.bulkCreate([EntityBuilder.buildRandTag(), EntityBuilder.buildRandTag()]);

    taggingRepo = container.get<TaggingSequelizeRepo>(TYPES.TaggingRepo);
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
