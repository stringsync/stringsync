import { inject, injectable } from '@stringsync/di';
import { Tagging } from '@stringsync/domain';
import { REPOS_TYPES, TaggingRepo } from '@stringsync/repos';

const TYPES = { ...REPOS_TYPES };

@injectable()
export class TaggingService {
  constructor(@inject(TYPES.TaggingRepo) public taggingRepo: TaggingRepo) {}

  async bulkCreate(taggings: Array<Omit<Tagging, 'id'>>): Promise<Tagging[]> {
    return await this.taggingRepo.bulkCreate(taggings);
  }
}
