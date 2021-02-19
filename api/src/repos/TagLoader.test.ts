import { isPlainObject, sortBy } from 'lodash';
import { Notation, Tag, Tagging, User } from '../domain';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { EntityBuilder } from '../testing';
import { ctor, randStr } from '../util';
import { SequelizeTagLoader } from './sequelize';
import { NotationRepo, TaggingRepo, TagLoader, TagRepo, UserRepo } from './types';

const ORIGINAL_TAG_LOADER = ctor(container.get<TagLoader>(TYPES.TagLoader));

describe.each([['SequelizeTagLoader', SequelizeTagLoader]])('%s', (name, Ctor) => {
  let tagLoader: TagLoader;
  let tagRepo: TagRepo;

  let tag1: Tag;
  let tag2: Tag;

  beforeAll(() => {
    container.rebind<TagLoader>(TYPES.TagLoader).to(Ctor);
  });

  beforeEach(async () => {
    tagLoader = container.get<TagLoader>(TYPES.TagLoader);
    tagRepo = container.get<TagRepo>(TYPES.TagRepo);
    [tag1, tag2] = await tagRepo.bulkCreate([EntityBuilder.buildRandTag(), EntityBuilder.buildRandTag()]);
  });

  afterAll(() => {
    container.rebind<TagLoader>(TYPES.TagLoader).to(ORIGINAL_TAG_LOADER);
  });

  describe('findById', () => {
    it('finds a tag by id', async () => {
      const tag = await tagLoader.findById(tag1.id);
      expect(tag).not.toBeNull();
      expect(tag!.id).toBe(tag1.id);
    });

    it('returns null for a tag that does not exist', async () => {
      const tag = await tagLoader.findById(randStr(10));
      expect(tag).toBeNull();
    });

    it('returns a plain object', async () => {
      const tag = await tagLoader.findById(tag1.id);
      expect(isPlainObject(tag)).toBe(true);
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
        EntityBuilder.buildRandNotation({ transcriberId: user2.id }),
      ]);

      taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
      [tagging1, tagging2] = await taggingRepo.bulkCreate([
        EntityBuilder.buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
        EntityBuilder.buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
        EntityBuilder.buildRandTagging({ notationId: notation2.id, tagId: tag1.id }),
      ]);
    });

    it('finds a tag by notation id', async () => {
      const tags = await tagLoader.findAllByNotationId(notation1.id);
      expect(sortBy(tags, 'id')).toStrictEqual(sortBy([tag1, tag2], 'id'));
    });
  });
});
