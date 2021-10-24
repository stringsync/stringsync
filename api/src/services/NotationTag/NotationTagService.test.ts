import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { NotationTagRepo } from '../../repos';
import { createRandNotation, createRandTags, createRandUser } from '../../testing';
import { NotationTagService } from './NotationTagService';

describe('TaggingService', () => {
  let taggingRepo: NotationTagRepo;
  let taggingService: NotationTagService;

  beforeEach(() => {
    taggingRepo = container.get<NotationTagRepo>(TYPES.NotationTagRepo);
    taggingService = container.get<NotationTagService>(TYPES.NotationTagService);
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
