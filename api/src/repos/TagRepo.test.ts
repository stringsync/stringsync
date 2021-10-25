import { isPlainObject } from 'lodash';
import { Notation, NotationTag, Tag, User } from '../domain';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { Ctor, ctor, rand } from '../util';
import { TagRepo as MikroORMTagRepo } from './mikro-orm';
import { NotationRepo, NotationTagRepo, TagRepo, UserRepo } from './types';

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
      await tagRepo.bulkCreate([rand.tag(), rand.tag(), rand.tag()]);
      const count = await tagRepo.count();

      expect(count).toBe(3);
    });
  });

  describe('validate', () => {
    it('permits valid tags', async () => {
      await expect(tagRepo.validate(rand.tag())).resolves.not.toThrow();
    });
  });

  describe('create', () => {
    it('creates a tag record', async () => {
      const countBefore = await tagRepo.count();
      await tagRepo.create(rand.tag());
      const countAfter = await tagRepo.count();
      expect(countAfter).toBe(countBefore + 1);
    });

    it('creates a findable user record', async () => {
      const { id } = await tagRepo.create(rand.tag());
      const tag = await tagRepo.find(id);

      expect(tag).not.toBeNull();
      expect(tag!.id).toBe(id);
    });

    it('returns a plain object', async () => {
      const tag = await tagRepo.create(rand.tag());

      expect(isPlainObject(tag)).toBe(true);
    });

    it('disallows duplicate tags', async () => {
      const tag = rand.tag({ id: undefined });
      await expect(tagRepo.create(tag)).resolves.not.toThrow();
      await expect(tagRepo.create(tag)).rejects.toThrow();
    });
  });

  describe('find', () => {
    it('returns the tag matching the id', async () => {
      const id = rand.str(8);
      await tagRepo.create(rand.tag({ id }));

      const tag = await tagRepo.find(id);

      expect(tag).not.toBeNull();
      expect(tag!.id).toBe(id);
    });

    it('returns a plain object', async () => {
      const { id } = await tagRepo.create(rand.tag());

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
      const tags = [rand.tag(), rand.tag(), rand.tag()];
      await tagRepo.bulkCreate(tags);

      const foundTags = await tagRepo.findAll();

      expect(foundTags).toIncludeAllMembers(tags);
    });

    it('returns plain objects', async () => {
      const tags = [rand.tag(), rand.tag(), rand.tag()];
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

    let notationTagRepo: NotationTagRepo;
    let notationTag1: NotationTag;
    let notationTag2: NotationTag;

    beforeEach(async () => {
      [tag1, tag2, tag3] = await tagRepo.bulkCreate([rand.tag(), rand.tag(), rand.tag()]);

      userRepo = container.get<UserRepo>(TYPES.UserRepo);
      [user1, user2] = await userRepo.bulkCreate([rand.user(), rand.user()]);

      notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
      [notation1, notation2] = await notationRepo.bulkCreate([
        rand.notation({ transcriberId: user1.id }),
        rand.notation({ transcriberId: user2.id }),
      ]);

      notationTagRepo = container.get<NotationTagRepo>(TYPES.NotationTagRepo);
      [notationTag1, notationTag2] = await notationTagRepo.bulkCreate([
        rand.notationTag({ notationId: notation1.id, tagId: tag1.id }),
        rand.notationTag({ notationId: notation1.id, tagId: tag2.id }),
        rand.notationTag({ notationId: notation2.id, tagId: tag1.id }),
      ]);
    });

    it('finds a tag by notation id', async () => {
      const tags = await tagRepo.findAllByNotationId(notation1.id);
      expect(tags).toIncludeAllMembers([tag1, tag2]);
    });
  });

  describe('update', () => {
    it('updates a tag', async () => {
      const tag = rand.tag();
      await tagRepo.create(tag);
      const name = rand.str(8);

      const updatedTag = await tagRepo.update(tag.id, { ...tag, name });

      expect(updatedTag.name).toBe(name);
    });

    it('returns plain objects', async () => {
      const tag = rand.tag();
      await tagRepo.create(tag);
      const name = rand.str(8);

      const updatedTag = await tagRepo.update(tag.id, { ...tag, name });

      expect(isPlainObject(updatedTag)).toBe(true);
    });
  });
});
