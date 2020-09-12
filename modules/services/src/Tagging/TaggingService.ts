import { injectable, inject } from 'inversify';
import { TaggingRepo } from '@stringsync/repos';
import { TYPES } from '@stringsync/di';
import { Tagging } from '@stringsync/domain';

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
