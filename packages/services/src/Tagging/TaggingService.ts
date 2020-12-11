import { inject, injectable } from '@stringsync/di';
import { Tagging } from '@stringsync/domain';
import { REPOS_TYPES, TaggingRepo } from '@stringsync/repos';

@injectable()
export class TaggingService {
  taggingRepo: TaggingRepo;

  constructor(@inject(REPOS_TYPES.TaggingRepo) taggingRepo: TaggingRepo) {
    this.taggingRepo = taggingRepo;
  }

  async bulkCreate(taggings: Array<Omit<Tagging, 'id'>>): Promise<Tagging[]> {
    return await this.taggingRepo.bulkCreate(taggings);
  }
}
