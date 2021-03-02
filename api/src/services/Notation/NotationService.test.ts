import { isPlainObject, sortBy } from 'lodash';
import { Notation, Tag, Tagging, User } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { NotationRepo, TaggingRepo, TagRepo, UserRepo } from '../../repos';
import { buildRandNotation, buildRandTagging, createRandTags, createRandUser } from '../../testing';
import { randStr } from '../../util';
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
      buildRandNotation({ transcriberId: user.id }),
      buildRandNotation({ transcriberId: user.id }),
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
      [tag1, tag2] = await createRandTags(2);

      taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
      [tagging1, tagging2] = await taggingRepo.bulkCreate([
        buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
        buildRandTagging({ notationId: notation2.id, tagId: tag1.id }),
        buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
      ]);
    });

    it('finds all notations by tag id', async () => {
      const notations = await notationService.findAllByTagId(tag1.id);
      expect(notations).toHaveLength(2);
      expect(sortBy(notations, 'id')).toStrictEqual(sortBy([notation1, notation2], 'id'));
    });
  });
});
