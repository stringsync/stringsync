import { useTestContainer, TYPES } from '@stringsync/di';
import { TaggingModel } from './TaggingModel';
import { TestFactory } from '@stringsync/common';
import { NotationRepo, TaggingRepo, TagRepo, UserRepo } from '@stringsync/repos';
import { Notation, Tag, Tagging, User } from '@stringsync/domain';
import { NotationModel } from './NotationModel';

const container = useTestContainer();

let tagRepo: TagRepo;
let notationRepo: NotationRepo;
let userRepo: UserRepo;
let taggingRepo: TaggingRepo;

let tag: Tag;
let user: User;
let notation: Notation;
let tagging: Tagging;

beforeEach(async () => {
  tagRepo = container.get<TagRepo>(TYPES.TagRepo);
  notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
  userRepo = container.get<UserRepo>(TYPES.UserRepo);
  taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);

  tag = await tagRepo.create(TestFactory.buildRandTag());
  user = await userRepo.create(TestFactory.buildRandUser());
  notation = await notationRepo.create(TestFactory.buildRandNotation({ transcriberId: user.id }));
  tagging = await taggingRepo.create(TestFactory.buildRandTagging({ notationId: notation.id, tagId: tag.id }));
});

it('permits valid taggings', async () => {
  const tagging = TaggingModel.build(TestFactory.buildRandTagging());
  await expect(tagging.validate()).resolves.not.toThrow();
});

it('fetches the tag association', async () => {
  const taggingDao = await TaggingModel.findByPk(tagging.id, { include: 'tag' });
  expect(taggingDao).not.toBeNull();
  expect(taggingDao!.tag).toBeDefined();
});

it('fetches the notation association', async () => {
  const taggingDao = await TaggingModel.findByPk(tagging.id, {
    include: [{ model: NotationModel as any, as: 'notation', required: true }],
  });
  expect(taggingDao).not.toBeNull();
  expect(taggingDao!.notation).toBeDefined();
});

it('does not fetch random associations', async () => {
  await expect(TaggingModel.findByPk(tagging.id, { include: 'fakeAssociation' })).rejects.toThrow();
});

it('prevents taggings with the same (notationId, tagId)', async () => {
  const taggingDao = await TaggingModel.findOne({
    where: { notationId: notation.id, tagId: tag.id },
  });
  expect(taggingDao).not.toBeNull();

  await expect(TaggingModel.create({ notationId: notation.id, tagId: tag.id })).rejects.toThrow();
});
