import { isPlainObject, sortBy } from 'lodash';
import { TestFactory, randStr } from '@stringsync/common';
import { TYPES, useTestContainer } from '@stringsync/container';
import { TagRepo } from '../../types';

const container = useTestContainer();

let tagRepo: TagRepo;

beforeEach(async () => {
  tagRepo = container.get<TagRepo>(TYPES.TagSequelizeRepo);
});

describe('count', () => {
  it('returns the number of tags', async () => {
    await tagRepo.bulkCreate([TestFactory.buildRandTag(), TestFactory.buildRandTag(), TestFactory.buildRandTag()]);
    const count = await tagRepo.count();

    expect(count).toBe(3);
  });
});

describe('create', () => {
  it('creates a tag record', async () => {
    const countBefore = await tagRepo.count();
    await tagRepo.create(TestFactory.buildRandTag());
    const countAfter = await tagRepo.count();
    expect(countAfter).toBe(countBefore + 1);
  });

  it('creates a findable user record', async () => {
    const { id } = await tagRepo.create(TestFactory.buildRandTag());
    const tag = await tagRepo.find(id);

    expect(tag).not.toBeNull();
    expect(tag!.id).toBe(id);
  });

  it('returns a plain object', async () => {
    const tag = await tagRepo.create(TestFactory.buildRandTag());

    expect(isPlainObject(tag)).toBe(true);
  });

  it('disallows duplicate ids', async () => {
    const id = randStr(8);
    const tag = TestFactory.buildRandTag({ id });

    await expect(tagRepo.create(tag)).resolves.not.toThrow();
    await expect(tagRepo.create(tag)).rejects.toThrow();
  });
});

describe('find', () => {
  it('returns the tag matching the id', async () => {
    const id = randStr(8);
    await tagRepo.create(TestFactory.buildRandTag({ id }));

    const tag = await tagRepo.find(id);

    expect(tag).not.toBeNull();
    expect(tag!.id).toBe(id);
  });

  it('returns a plain object', async () => {
    const { id } = await tagRepo.create(TestFactory.buildRandTag());

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
    const tags = [TestFactory.buildRandTag(), TestFactory.buildRandTag(), TestFactory.buildRandTag()];
    await tagRepo.bulkCreate(tags);

    const foundTags = await tagRepo.findAll();

    expect(sortBy(foundTags, 'id')).toStrictEqual(sortBy(tags, 'id'));
  });

  it('returns plain objects', async () => {
    const tags = [TestFactory.buildRandTag(), TestFactory.buildRandTag(), TestFactory.buildRandTag()];
    await tagRepo.bulkCreate(tags);

    const foundTags = await tagRepo.findAll();

    expect(foundTags.every(isPlainObject)).toBe(true);
  });
});

describe('update', () => {
  it('updates a tag', async () => {
    const tag = TestFactory.buildRandTag();
    await tagRepo.create(tag);
    const name = randStr(8);
    const updatedTag = { ...tag, name };

    await tagRepo.update(tag.id, updatedTag);

    const foundTag = await tagRepo.find(tag.id);
    expect(foundTag).not.toBeNull();
    expect(foundTag!.name).toBe(name);
  });
});
