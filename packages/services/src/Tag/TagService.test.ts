import { randStr } from '@stringsync/common';
import { Container, useTestContainer } from '@stringsync/di';
import { EntityBuilder, Notation, Tag, Tagging, User } from '@stringsync/domain';
import { NotationRepo, REPOS_TYPES, TaggingRepo, TagRepo, UserRepo } from '@stringsync/repos';
import { isPlainObject, sortBy } from 'lodash';
import { SERVICES } from '../SERVICES';
import { SERVICES_TYPES } from '../SERVICES_TYPES';
import { TagService } from './TagService';

const TYPES = { ...SERVICES_TYPES, ...REPOS_TYPES };

describe('TagService', () => {
  const ref = useTestContainer(SERVICES);

  let container: Container;

  let tagRepo: TagRepo;
  let tag1: Tag;
  let tag2: Tag;

  let tagService: TagService;

  beforeEach(() => {
    container = ref.container;
  });

  beforeEach(async () => {
    tagRepo = container.get<TagRepo>(TYPES.TagRepo);
    [tag1, tag2] = await tagRepo.bulkCreate([EntityBuilder.buildRandTag(), EntityBuilder.buildRandTag()]);

    tagService = container.get<TagService>(TYPES.TagService);
  });

  describe('find', () => {
    it('finds tag by id', async () => {
      const tag = await tagService.find(tag1.id);
      expect(tag).not.toBeNull();
      expect(tag!.id).toBe(tag1.id);
    });

    it('returns not if tag does not exist', async () => {
      const tag = await tagService.find(randStr(10));
      expect(tag).toBeNull();
    });

    it('returns a plain object', async () => {
      const tag = await tagService.find(tag1.id);
      expect(tag).not.toBeNull();
      expect(isPlainObject(tag)).toBe(true);
    });
  });

  describe('findAll', () => {
    it('returns all tags', async () => {
      const tags = await tagService.findAll();
      expect(sortBy(tags, 'id')).toStrictEqual(sortBy([tag1, tag2], 'id'));
    });

    it('returns plain objects', async () => {
      const tags = await tagService.findAll();
      expect(tags.every(isPlainObject)).toBe(true);
    });
  });

  describe('findAllByNotationId', () => {
    let userRepo: UserRepo;
    let user1: User;
    let user2: User;

    let notationRepo: NotationRepo;
    let notation1: Notation;
    let notation2: Notation;

    let taggingRepo: TaggingRepo;
    let tagging1: Tagging;
    let tagging2: Tagging;

    beforeEach(async () => {
      userRepo = container.get<UserRepo>(TYPES.UserRepo);
      [user1, user2] = await userRepo.bulkCreate([EntityBuilder.buildRandUser(), EntityBuilder.buildRandUser()]);

      notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
      [notation1, notation2] = await notationRepo.bulkCreate([
        EntityBuilder.buildRandNotation({ transcriberId: user1.id }),
        EntityBuilder.buildRandNotation({ transcriberId: user1.id }),
      ]);

      taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
      [tagging1, tagging2] = await taggingRepo.bulkCreate([
        EntityBuilder.buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
        EntityBuilder.buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
        EntityBuilder.buildRandTagging({ notationId: notation2.id, tagId: tag1.id }),
      ]);
    });

    it('returns all tags related to a notation', async () => {
      const tags = await tagService.findAllByNotationId(notation1.id);
      expect(sortBy(tags, 'id')).toStrictEqual(sortBy([tag1, tag2], 'id'));
    });

    it('returns plain objects', async () => {
      const tags = await tagService.findAllByNotationId(notation1.id);
      expect(tags).toHaveLength(2);
      expect(tags.every(isPlainObject)).toBe(true);
    });
  });
});
