import { isPlainObject } from 'lodash';
import { Notation, NotationTag, Tag, User } from '../domain';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { Ctor, ctor, rand } from '../util';
import { NotationTagRepo as MikroORMTaggingRepo } from './mikro-orm';
import { NotationRepo, NotationTagRepo, TagRepo, UserRepo } from './types';

describe.each([['MikroORMTaggingRepo', MikroORMTaggingRepo]])('%s', (name, Ctor) => {
  let ORIGINAL_TAGGING_REPO: Ctor<NotationTagRepo>;
  let taggingRepo: NotationTagRepo;

  let user1: User;
  let user2: User;

  let notation1: Notation;
  let notation2: Notation;

  let tag1: Tag;
  let tag2: Tag;

  let tagging1: NotationTag;
  let tagging2: NotationTag;

  beforeAll(() => {
    ORIGINAL_TAGGING_REPO = ctor(container.get<NotationTagRepo>(TYPES.NotationTagRepo));
    container.rebind<NotationTagRepo>(TYPES.NotationTagRepo).to(Ctor);
  });

  beforeEach(() => {
    taggingRepo = container.get<NotationTagRepo>(TYPES.NotationTagRepo);
  });

  afterAll(() => {
    container.rebind<NotationTagRepo>(TYPES.NotationTagRepo).to(ORIGINAL_TAGGING_REPO);
  });

  beforeEach(async () => {
    const userRepo = container.get<UserRepo>(TYPES.UserRepo);
    [user1, user2] = await userRepo.bulkCreate([rand.user(), rand.user()]);

    const notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
    [notation1, notation2] = await notationRepo.bulkCreate([
      rand.notation({ transcriberId: user1.id }),
      rand.notation({ transcriberId: user2.id }),
    ]);

    const tagRepo = container.get<TagRepo>(TYPES.TagRepo);
    [tag1, tag2] = await tagRepo.bulkCreate([rand.tag(), rand.tag()]);

    [tagging1, tagging2] = await taggingRepo.bulkCreate([
      rand.notationTag({ notationId: notation1.id, tagId: tag1.id }),
      rand.notationTag({ notationId: notation1.id, tagId: tag2.id }),
      rand.notationTag({ notationId: notation2.id, tagId: tag1.id }),
    ]);
  });

  describe('count', () => {
    it('counts the number of taggings', async () => {
      const count = await taggingRepo.count();
      expect(count).toBe(3);
    });
  });

  describe('validate', () => {
    it('permits valid taggings', async () => {
      await expect(taggingRepo.validate(rand.notationTag())).resolves.not.toThrow();
    });
  });

  describe('create', () => {
    it('creates a tagging record', async () => {
      const countBefore = await taggingRepo.count();
      await taggingRepo.create(rand.notationTag({ notationId: notation2.id, tagId: tag2.id }));
      const countAfter = await taggingRepo.count();

      expect(countAfter).toBe(countBefore + 1);
    });

    it('creates a findable tagging record', async () => {
      const { id } = await taggingRepo.create(rand.notationTag({ notationId: notation2.id, tagId: tag2.id }));
      const tagging = await taggingRepo.find(id);

      expect(tagging).not.toBeNull();
      expect(tagging!.id).toBe(id);
    });

    it('returns a plain object', async () => {
      const tagging = await taggingRepo.create(rand.notationTag({ notationId: notation2.id, tagId: tag2.id }));

      expect(isPlainObject(tagging)).toBe(true);
    });

    it('disallows duplicate taggings', async () => {
      const tagging = rand.notationTag({ id: undefined, notationId: notation2.id, tagId: tag2.id });

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
