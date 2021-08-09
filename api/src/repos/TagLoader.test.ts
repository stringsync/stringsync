import { isPlainObject } from 'lodash';
import { Db } from '../db';
import { Notation, Tag, Tagging, User } from '../domain';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { buildRandNotation, buildRandTag, buildRandTagging, buildRandUser } from '../testing';
import { Ctor, ctor, randStr } from '../util';
import { TagLoader as MikroORMTagLoader } from './mikro-orm';
import { getEntityManager } from './mikro-orm/getEntityManager';
import { NotationRepo, TaggingRepo, TagLoader, TagRepo, UserRepo } from './types';

describe.each([['MikroORMTagLoader', MikroORMTagLoader]])('%s', (name, Ctor) => {
  let ORIGINAL_TAG_LOADER: Ctor<TagLoader>;
  let tagLoader: TagLoader;
  let tagRepo: TagRepo;

  let tag1: Tag;
  let tag2: Tag;

  beforeAll(() => {
    ORIGINAL_TAG_LOADER = ctor(container.get<TagLoader>(TYPES.TagLoader));
    container.rebind<TagLoader>(TYPES.TagLoader).to(Ctor);
  });

  beforeEach(async () => {
    tagLoader = container.get<TagLoader>(TYPES.TagLoader);
    tagRepo = container.get<TagRepo>(TYPES.TagRepo);
    [tag1, tag2] = await tagRepo.bulkCreate([buildRandTag(), buildRandTag()]);

    const db = container.get<Db>(TYPES.Db);
    getEntityManager(db).clear();
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
      [user1, user2] = await userRepo.bulkCreate([buildRandUser(), buildRandUser()]);

      notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
      [notation1, notation2] = await notationRepo.bulkCreate([
        buildRandNotation({ transcriberId: user1.id }),
        buildRandNotation({ transcriberId: user2.id }),
      ]);

      taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
      [tagging1, tagging2] = await taggingRepo.bulkCreate([
        buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
        buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
        buildRandTagging({ notationId: notation2.id, tagId: tag1.id }),
      ]);

      const db = container.get<Db>(TYPES.Db);
      getEntityManager(db).clear();
    });

    it('finds a tag by notation id', async () => {
      const tags = await tagLoader.findAllByNotationId(notation1.id);
      expect(tags).toIncludeAllMembers([tag1, tag2]);
    });
  });
});
