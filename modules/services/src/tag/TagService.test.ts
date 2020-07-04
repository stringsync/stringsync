import { isPlainObject, sortBy } from 'lodash';
import { TagRepo, UserRepo, NotationRepo, TaggingRepo } from '@stringsync/repos';
import { useTestContainer, TYPES } from '@stringsync/container';
import { TagService } from './TagService';
import { Tag, User, Notation, Tagging } from '@stringsync/domain';
import { randStr, TestFactory } from '@stringsync/common';

const container = useTestContainer();

let tagRepo: TagRepo;
let tag1: Tag;
let tag2: Tag;

let tagService: TagService;

beforeEach(async () => {
  tagRepo = container.get<TagRepo>(TYPES.TagRepo);
  [tag1, tag2] = await tagRepo.bulkCreate([TestFactory.buildRandTag(), TestFactory.buildRandTag()]);

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
    [user1, user2] = await userRepo.bulkCreate([TestFactory.buildRandUser(), TestFactory.buildRandUser()]);

    notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
    [notation1, notation2] = await notationRepo.bulkCreate([
      TestFactory.buildRandNotation({ transcriberId: user1.id }),
      TestFactory.buildRandNotation({ transcriberId: user1.id }),
    ]);

    taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
    [tagging1, tagging2] = await taggingRepo.bulkCreate([
      TestFactory.buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
      TestFactory.buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
      TestFactory.buildRandTagging({ notationId: notation2.id, tagId: tag1.id }),
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
