import { randStr } from '@stringsync/common';
import { Container, useTestContainer } from '@stringsync/di';
import { EntityBuilder, Notation, Tag, Tagging, User } from '@stringsync/domain';
import { isPlainObject, sortBy } from 'lodash';
import { REPOS } from '../../REPOS';
import { REPOS_TYPES } from '../../REPOS_TYPES';
import { NotationRepo, TaggingRepo, TagRepo, UserRepo } from '../../types';
import { NotationSequelizeRepo } from '../notation';
import { TaggingSequelizeRepo } from '../tagging';
import { UserSequelizeRepo } from '../user';
import { TagSequelizeLoader } from './TagSequelizeLoader';

const TYPES = { ...REPOS_TYPES };

const ref = useTestContainer(REPOS);

let container: Container;

let tagLoader: TagSequelizeLoader;
let tagRepo: TagRepo;

let tag1: Tag;
let tag2: Tag;

beforeEach(() => {
  container = ref.container;
  container.rebind<TagSequelizeLoader>(TYPES.TagLoader).to(TagSequelizeLoader);
});

beforeEach(async () => {
  tagLoader = container.get<TagSequelizeLoader>(TYPES.TagLoader);
  tagRepo = container.get<TagRepo>(TYPES.TagRepo);
  [tag1, tag2] = await tagRepo.bulkCreate([EntityBuilder.buildRandTag(), EntityBuilder.buildRandTag()]);
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
    userRepo = container.get<UserSequelizeRepo>(TYPES.UserRepo);
    [user1, user2] = await userRepo.bulkCreate([EntityBuilder.buildRandUser(), EntityBuilder.buildRandUser()]);

    notationRepo = container.get<NotationSequelizeRepo>(TYPES.NotationRepo);
    [notation1, notation2] = await notationRepo.bulkCreate([
      EntityBuilder.buildRandNotation({ transcriberId: user1.id }),
      EntityBuilder.buildRandNotation({ transcriberId: user2.id }),
    ]);

    taggingRepo = container.get<TaggingSequelizeRepo>(TYPES.TaggingRepo);
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
