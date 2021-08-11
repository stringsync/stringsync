import { isPlainObject } from 'lodash';
import { Notation, Tag, Tagging, User } from '../domain';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { buildRandNotation, buildRandTag, buildRandTagging, buildRandUser } from '../testing';
import { Ctor, ctor, randStr } from '../util';
import { TagRepo as MikroORMTagRepo } from './mikro-orm';
import { NotationRepo, TaggingRepo, TagRepo, UserRepo } from './types';

describe.each([['MikroORMTagRepo', MikroORMTagRepo]])('%s', (name, Ctor) => {
  let ORIGINAL_TAG_REPO: Ctor<TagRepo>;
  let tagRepo: TagRepo;

  beforeAll(() => {
    ORIGINAL_TAG_REPO = ctor(container.get<TagRepo>(TYPES.TagRepo));
    container.rebind<TagRepo>(TYPES.TagRepo).to(Ctor);
  });

  beforeEach(() => {
    tagRepo = container.get<TagRepo>(TYPES.TagRepo);
  });

  afterAll(() => {
    container.rebind<TagRepo>(TYPES.TagRepo).to(ORIGINAL_TAG_REPO);
  });

  describe('count', () => {
    it('returns the number of tags', async () => {
      await tagRepo.bulkCreate([buildRandTag(), buildRandTag(), buildRandTag()]);
      const count = await tagRepo.count();

      expect(count).toBe(3);
    });
  });

  describe('validate', () => {
    it('permits valid tags', async () => {
      await expect(tagRepo.validate(buildRandTag())).resolves.not.toThrow();
    });
  });

  describe('create', () => {
    it('creates a tag record', async () => {
      const countBefore = await tagRepo.count();
      await tagRepo.create(buildRandTag());
      const countAfter = await tagRepo.count();
      expect(countAfter).toBe(countBefore + 1);
    });

    it('creates a findable user record', async () => {
      const { id } = await tagRepo.create(buildRandTag());
      const tag = await tagRepo.find(id);

      expect(tag).not.toBeNull();
      expect(tag!.id).toBe(id);
    });

    it('returns a plain object', async () => {
      const tag = await tagRepo.create(buildRandTag());

      expect(isPlainObject(tag)).toBe(true);
    });

    it('disallows duplicate tags', async () => {
      const tag = buildRandTag({ id: undefined });
      await expect(tagRepo.create(tag)).resolves.not.toThrow();
      await expect(tagRepo.create(tag)).rejects.toThrow();
    });
  });

  describe('find', () => {
    it('returns the tag matching the id', async () => {
      const id = randStr(8);
      await tagRepo.create(buildRandTag({ id }));

      const tag = await tagRepo.find(id);

      expect(tag).not.toBeNull();
      expect(tag!.id).toBe(id);
    });

    it('returns a plain object', async () => {
      const { id } = await tagRepo.create(buildRandTag());

      const tag = await tagRepo.find(id);

      expect(isPlainObject(tag)).toBe(true);
    });

    it('returns null when no tag found', async () => {
      const tag = await tagRepo.find('id');

      expect(tag).toBeNull();
    });
  });

  describe('findAll', () => {
    it('returns all tag records', async () => {
      const tags = [buildRandTag(), buildRandTag(), buildRandTag()];
      await tagRepo.bulkCreate(tags);

      const foundTags = await tagRepo.findAll();

      expect(foundTags).toIncludeAllMembers(tags);
    });

    it('returns plain objects', async () => {
      const tags = [buildRandTag(), buildRandTag(), buildRandTag()];
      await tagRepo.bulkCreate(tags);

      const foundTags = await tagRepo.findAll();

      expect(foundTags.every(isPlainObject)).toBe(true);
    });
  });

  describe('findAllByNotationId', () => {
    let tag1: Tag;
    let tag2: Tag;
    let tag3: Tag;

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
      [tag1, tag2, tag3] = await tagRepo.bulkCreate([buildRandTag(), buildRandTag(), buildRandTag()]);

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
    });

    it('finds a tag by notation id', async () => {
      const tags = await tagRepo.findAllByNotationId(notation1.id);
      expect(tags).toIncludeAllMembers([tag1, tag2]);
    });
  });

  describe('update', () => {
    it('updates a tag', async () => {
      const tag = buildRandTag();
      await tagRepo.create(tag);
      const name = randStr(8);

      const updatedTag = await tagRepo.update(tag.id, { ...tag, name });

      expect(updatedTag.name).toBe(name);
    });

    it('returns plain objects', async () => {
      const tag = buildRandTag();
      await tagRepo.create(tag);
      const name = randStr(8);

      const updatedTag = await tagRepo.update(tag.id, { ...tag, name });

      expect(isPlainObject(updatedTag)).toBe(true);
    });
  });
});
