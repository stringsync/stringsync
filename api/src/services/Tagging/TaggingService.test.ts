import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { NotationRepo, TaggingRepo, TagRepo, UserRepo } from '../../repos';
import { EntityBuilder } from '../../testing';
import { TaggingService } from './TaggingService';

describe('TaggingService', () => {
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

      const user = await userRepo.create(EntityBuilder.buildRandUser());
      const [tag1, tag2, _] = await tagRepo.bulkCreate([
        EntityBuilder.buildRandTag(),
        EntityBuilder.buildRandTag(),
        EntityBuilder.buildRandTag(),
      ]);
      const notation = await notationRepo.create(EntityBuilder.buildRandNotation({ transcriberId: user.id }));

      await taggingService.bulkCreate([
        { notationId: notation.id, tagId: tag1.id },
        { notationId: notation.id, tagId: tag2.id },
      ]);

      expect(await taggingRepo.count()).toBe(2);
    });
  });
});
