import { randStr } from '@stringsync/common';
import { Container, useTestContainer } from '@stringsync/di';
import { EntityBuilder, Notation, Tag, Tagging, User } from '@stringsync/domain';
import { NotationRepo, REPOS_TYPES, TaggingRepo, TagRepo, UserRepo } from '@stringsync/repos';
import { isPlainObject, sortBy } from 'lodash';
import { SERVICES } from '../SERVICES';
import { SERVICES_TYPES } from '../SERVICES_TYPES';
import { NotationService } from './NotationService';

const TYPES = { ...SERVICES_TYPES, ...REPOS_TYPES };

describe('NotationService', () => {
  const ref = useTestContainer(SERVICES);

  let container: Container;

  let userRepo: UserRepo;
  let notationRepo: NotationRepo;

  let user: User;
  let notation1: Notation;
  let notation2: Notation;

  let notationService: NotationService;

  beforeEach(() => {
    container = ref.container;
  });

  beforeEach(async () => {
    userRepo = container.get<UserRepo>(TYPES.UserRepo);
    notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);

    user = await userRepo.create(EntityBuilder.buildRandUser());
    [notation1, notation2] = await notationRepo.bulkCreate([
      EntityBuilder.buildRandNotation({ transcriberId: user.id }),
      EntityBuilder.buildRandNotation({ transcriberId: user.id }),
    ]);

    notationService = container.get<NotationService>(TYPES.NotationService);
  });

  describe('findAllByTranscriberId', () => {
    it('returns notations belonging to the user', async () => {
      const notations = await notationService.findAllByTranscriberId(user.id);
      expect(sortBy(notations, 'id')).toStrictEqual(sortBy([notation1, notation2], 'id'));
    });

    it('returns an array of plain objects', async () => {
      const notations = await notationService.findAllByTranscriberId(user.id);
      expect(notations).toHaveLength(2);
      expect(notations.every(isPlainObject)).toBe(true);
    });

    it('returns an empty array for users that do not exist', async () => {
      const notations = await notationService.findAllByTranscriberId(randStr(10));
      expect(notations).toBeInstanceOf(Array);
      expect(notations).toHaveLength(0);
    });
  });

  describe('findAllByTagId', () => {
    let tagRepo: TagRepo;
    let tag1: Tag;
    let tag2: Tag;

    let taggingRepo: TaggingRepo;
    let tagging1: Tagging;
    let tagging2: Tagging;

    beforeEach(async () => {
      tagRepo = container.get<TagRepo>(TYPES.TagRepo);
      [tag1, tag2] = await tagRepo.bulkCreate([EntityBuilder.buildRandTag(), EntityBuilder.buildRandTag()]);

      taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
      [tagging1, tagging2] = await taggingRepo.bulkCreate([
        EntityBuilder.buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
        EntityBuilder.buildRandTagging({ notationId: notation2.id, tagId: tag1.id }),
        EntityBuilder.buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
      ]);
    });

    it('finds all notations by tag id', async () => {
      const notations = await notationService.findAllByTagId(tag1.id);
      expect(notations).toHaveLength(2);
      expect(sortBy(notations, 'id')).toStrictEqual(sortBy([notation1, notation2], 'id'));
    });
  });
});
