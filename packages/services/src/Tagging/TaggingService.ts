import { inject, injectable } from '@stringsync/di';
import { Tagging } from '@stringsync/domain';
import { REPOS, TaggingRepo } from '@stringsync/repos';

const TYPES = { ...REPOS.TYPES };

@injectable()
export class TaggingService {
  taggingRepo: TaggingRepo;

  constructor(@inject(TYPES.TaggingRepo) taggingRepo: TaggingRepo) {
    this.taggingRepo = taggingRepo;
  }

  async bulkCreate(taggings: Array<Omit<Tagging, 'id'>>): Promise<Tagging[]> {
    return await this.taggingRepo.bulkCreate(taggings);
  }
}
