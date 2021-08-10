import { isPlainObject } from 'lodash';
import { Notation, Tag, Tagging, User } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { NotationRepo, TaggingRepo, TagRepo, UserRepo } from '../../repos';
import { buildRandNotation, buildRandTagging, createRandTags, createRandUsers } from '../../testing';
import { randStr } from '../../util';
import { TagService } from './TagService';

describe('TagService', () => {
  let tagRepo: TagRepo;
  let tag1: Tag;
  let tag2: Tag;

  let tagService: TagService;

  beforeEach(async () => {
    tagRepo = container.get<TagRepo>(TYPES.TagRepo);
    [tag1, tag2] = await createRandTags(2);

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
      expect(tags).toIncludeAllMembers([tag1, tag2]);
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
      [user1, user2] = await createRandUsers(2);

      notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
      [notation1, notation2] = await notationRepo.bulkCreate([
        buildRandNotation({ transcriberId: user1.id }),
        buildRandNotation({ transcriberId: user1.id }),
      ]);

      taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
      [tagging1, tagging2] = await taggingRepo.bulkCreate([
        buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
        buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
        buildRandTagging({ notationId: notation2.id, tagId: tag1.id }),
      ]);
    });

    it('returns all tags related to a notation', async () => {
      const tags = await tagService.findAllByNotationId(notation1.id);
      expect(tags).toStrictEqual([tag1, tag2]);
    });

    it('returns plain objects', async () => {
      const tags = await tagService.findAllByNotationId(notation1.id);
      expect(tags).toHaveLength(2);
      expect(tags.every(isPlainObject)).toBe(true);
    });
  });
});
