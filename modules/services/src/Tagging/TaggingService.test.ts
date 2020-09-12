import { TaggingService } from './TaggingService';
import { TaggingRepo, TagRepo, NotationRepo, UserRepo } from '@stringsync/repos';
import { useTestContainer, TYPES } from '@stringsync/di';
import { Notation, Tag } from '@stringsync/domain';
import { TestFactory } from '@stringsync/common';
import { sortBy } from 'lodash';

const container = useTestContainer();

let taggingRepo: TaggingRepo;
let tagRepo: TagRepo;
let notationRepo: NotationRepo;
let userRepo: UserRepo;

let taggingService: TaggingService;

beforeEach(() => {
  taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
  tagRepo = container.get<TagRepo>(TYPES.TagRepo);
  notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
  userRepo = container.get<UserRepo>(TYPES.UserRepo);

  taggingService = container.get<TaggingService>(TYPES.TaggingService);
});

describe('bulkCreate', () => {
  it('creates many taggings', async () => {
    expect(await taggingRepo.count()).toBe(0);

    const user = await userRepo.create(TestFactory.buildRandUser());
    const [tag1, tag2, tag3] = await tagRepo.bulkCreate([
      TestFactory.buildRandTag(),
      TestFactory.buildRandTag(),
      TestFactory.buildRandTag(),
    ]);
    const notation = await notationRepo.create(TestFactory.buildRandNotation({ transcriberId: user.id }));

    const taggings = await taggingService.bulkCreate([
      { notationId: notation.id, tagId: tag1.id },
      { notationId: notation.id, tagId: tag2.id },
    ]);

    expect(await taggingRepo.count()).toBe(2);
  });
});
