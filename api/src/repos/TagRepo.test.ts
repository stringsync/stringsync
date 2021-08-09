import { EntityManager } from '@mikro-orm/core';
import { isPlainObject, sortBy } from 'lodash';
import { Db } from '../db';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { buildRandTag } from '../testing';
import { Ctor, ctor, randStr } from '../util';
import { TagRepo as MikroORMTagRepo } from './mikro-orm';
import { getEntityManager } from './mikro-orm/getEntityManager';
import { TagRepo } from './types';

describe.each([['MikroORMTagRepo', MikroORMTagRepo]])('%s', (name, Ctor) => {
  let ORIGINAL_TAG_REPO: Ctor<TagRepo>;
  let tagRepo: TagRepo;
  let em: EntityManager;

  beforeAll(() => {
    ORIGINAL_TAG_REPO = ctor(container.get<TagRepo>(TYPES.TagRepo));
    container.rebind<TagRepo>(TYPES.TagRepo).to(Ctor);
  });

  beforeEach(() => {
    tagRepo = container.get<TagRepo>(TYPES.TagRepo);
    const db = container.get<Db>(TYPES.Db);
    em = getEntityManager(db);
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

      expect(sortBy(foundTags, 'id')).toStrictEqual(sortBy(tags, 'id'));
    });

    it('returns plain objects', async () => {
      const tags = [buildRandTag(), buildRandTag(), buildRandTag()];
      await tagRepo.bulkCreate(tags);

      const foundTags = await tagRepo.findAll();

      expect(foundTags.every(isPlainObject)).toBe(true);
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
