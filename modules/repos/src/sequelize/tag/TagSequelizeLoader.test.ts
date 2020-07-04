import { UserSequelizeRepo } from '../user';
import { NotationSequelizeRepo } from '../notation';
import { TaggingSequelizeRepo } from '../tagging';
import { isPlainObject, sortBy } from 'lodash';
import { randStr, buildRandTag, buildRandTagging, buildRandNotation, buildRandUser } from '@stringsync/common';
import { Tag, Notation, Tagging, User } from '@stringsync/domain';
import { useTestContainer, TYPES } from '@stringsync/container';
import { TagSequelizeLoader } from './TagSequelizeLoader';
import { TagSequelizeRepo } from './TagSequelizeRepo';

const container = useTestContainer();

let tagLoader: TagSequelizeLoader;
let tagRepo: TagSequelizeRepo;
let tag1: Tag;
let tag2: Tag;

beforeEach(async () => {
  tagLoader = container.get<TagSequelizeLoader>(TYPES.TagSequelizeLoader);
  tagRepo = container.get<TagSequelizeRepo>(TYPES.TagSequelizeRepo);
  [tag1, tag2] = await tagRepo.bulkCreate([buildRandTag(), buildRandTag()]);
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
  let userRepo: UserSequelizeRepo;
  let user1: User;
  let user2: User;

  let notationRepo: NotationSequelizeRepo;
  let notation1: Notation;
  let notation2: Notation;

  let taggingRepo: TaggingSequelizeRepo;
  let tagging1: Tagging;
  let tagging2: Tagging;

  beforeEach(async () => {
    userRepo = container.get<UserSequelizeRepo>(TYPES.UserSequelizeRepo);
    [user1, user2] = await userRepo.bulkCreate([buildRandUser(), buildRandUser()]);

    notationRepo = container.get<NotationSequelizeRepo>(TYPES.NotationSequelizeRepo);
    [notation1, notation2] = await notationRepo.bulkCreate([
      buildRandNotation({ transcriberId: user1.id }),
      buildRandNotation({ transcriberId: user2.id }),
    ]);

    taggingRepo = container.get<TaggingSequelizeRepo>(TYPES.TaggingSequelizeRepo);
    [tagging1, tagging2] = await taggingRepo.bulkCreate([
      buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
      buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
      buildRandTagging({ notationId: notation2.id, tagId: tag1.id }),
    ]);
  });

  it('finds a tag by notation id', async () => {
    const tags = await tagLoader.findAllByNotationId(notation1.id);
    expect(sortBy(tags, 'id')).toStrictEqual(sortBy([tag1, tag2], 'id'));
  });
});
