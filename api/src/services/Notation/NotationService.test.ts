import { isPlainObject } from 'lodash';
import { Notation, NotationTag, Tag, User } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { NotationRepo, NotationTagRepo, TagRepo, UserRepo } from '../../repos';
import { createRandTags, createRandUser } from '../../testing';
import { rand } from '../../util';
import { NotationService } from './NotationService';

describe('NotationService', () => {
  let userRepo: UserRepo;
  let notationRepo: NotationRepo;

  let user: User;
  let notation1: Notation;
  let notation2: Notation;

  let notationService: NotationService;

  beforeEach(async () => {
    userRepo = container.get<UserRepo>(TYPES.UserRepo);
    notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);

    user = await createRandUser();
    [notation1, notation2] = await notationRepo.bulkCreate([
      rand.notation({ transcriberId: user.id, cursor: 1 }),
      rand.notation({ transcriberId: user.id, cursor: 2 }),
    ]);

    notationService = container.get<NotationService>(TYPES.NotationService);
  });

  describe('findAllByTranscriberId', () => {
    it('returns notations belonging to the user', async () => {
      const notations = await notationService.findAllByTranscriberId(user.id);
      expect(notations).toStrictEqual([notation2, notation1]);
    });

    it('returns an array of plain objects', async () => {
      const notations = await notationService.findAllByTranscriberId(user.id);
      expect(notations).toHaveLength(2);
      expect(notations.every(isPlainObject)).toBe(true);
    });

    it('returns an empty array for users that do not exist', async () => {
      const notations = await notationService.findAllByTranscriberId(rand.str(10));
      expect(notations).toBeInstanceOf(Array);
      expect(notations).toHaveLength(0);
    });
  });

  describe('findAllByTagId', () => {
    let tagRepo: TagRepo;
    let tag1: Tag;
    let tag2: Tag;

    let notationTagRepo: NotationTagRepo;
    let notationTag1: NotationTag;
    let notationTag2: NotationTag;

    beforeEach(async () => {
      tagRepo = container.get<TagRepo>(TYPES.TagRepo);
      [tag1, tag2] = await createRandTags(2);

      notationTagRepo = container.get<NotationTagRepo>(TYPES.NotationTagRepo);
      [notationTag1, notationTag2] = await notationTagRepo.bulkCreate([
        rand.notationTag({ notationId: notation1.id, tagId: tag1.id }),
        rand.notationTag({ notationId: notation2.id, tagId: tag1.id }),
        rand.notationTag({ notationId: notation1.id, tagId: tag2.id }),
      ]);
    });

    it('finds all notations by tag id', async () => {
      const notations = await notationService.findAllByTagId(tag1.id);
      expect(notations).toIncludeAllMembers([notation1, notation2]);
    });
  });

  describe('findSuggestions', () => {
    it('returns suggestions for non-existent notations', async () => {
      const suggestedNotations = await notationService.findSuggestions('not-an-id-i-promise', 2);
      expect(suggestedNotations).toIncludeAllMembers([notation1, notation2]);
    });

    it('returns suggestions for existent notations', async () => {
      const suggestedNotations = await notationService.findSuggestions(notation1.id, 1);
      expect(suggestedNotations).toIncludeAllMembers([notation2]);
    });

    it('returns all suggestions with a high limit', async () => {
      const suggestedNotations = await notationService.findSuggestions('random-id-i-promise', 5);
      expect(suggestedNotations).toIncludeAllMembers([notation1, notation2]);
    });
  });
});
