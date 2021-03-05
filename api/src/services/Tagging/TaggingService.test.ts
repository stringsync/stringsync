import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { TaggingRepo } from '../../repos';
import { createRandNotation, createRandTags, createRandUser } from '../../testing';
import { TaggingService } from './TaggingService';

describe('TaggingService', () => {
  let taggingRepo: TaggingRepo;
  let taggingService: TaggingService;

  beforeEach(() => {
    taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
    taggingService = container.get<TaggingService>(TYPES.TaggingService);
  });

  describe('bulkCreate', () => {
    it('creates many taggings', async () => {
      expect(await taggingRepo.count()).toBe(0);

      const user = await createRandUser();
      const [tag1, tag2, _] = await createRandTags(2);
      const notation = await createRandNotation({ transcriberId: user.id });

      await taggingService.bulkCreate([
        { notationId: notation.id, tagId: tag1.id },
        { notationId: notation.id, tagId: tag2.id },
      ]);

      expect(await taggingRepo.count()).toBe(2);
    });
  });
});
