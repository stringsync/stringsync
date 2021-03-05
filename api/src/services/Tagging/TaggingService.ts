import { inject, injectable } from 'inversify';
import { Tagging } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { TaggingRepo } from '../../repos';

@injectable()
export class TaggingService {
  constructor(@inject(TYPES.TaggingRepo) public taggingRepo: TaggingRepo) {}

  async bulkCreate(taggings: Array<Omit<Tagging, 'id'>>): Promise<Tagging[]> {
    return await this.taggingRepo.bulkCreate(taggings);
  }
}
