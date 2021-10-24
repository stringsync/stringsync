import { inject, injectable } from 'inversify';
import { NotationTag } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { NotationTagRepo } from '../../repos';

@injectable()
export class NotationTagService {
  constructor(@inject(TYPES.NotationTagRepo) public taggingRepo: NotationTagRepo) {}

  async bulkCreate(taggings: Array<Omit<NotationTag, 'id'>>): Promise<NotationTag[]> {
    return await this.taggingRepo.bulkCreate(taggings);
  }
}
