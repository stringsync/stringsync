import { inject, injectable } from 'inversify';
import { Tag } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { TagRepo } from '../../repos';

@injectable()
export class TagService {
  constructor(@inject(TYPES.TagRepo) public tagRepo: TagRepo) {}

  async find(id: string): Promise<Tag | null> {
    return await this.tagRepo.find(id);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepo.findAll();
  }

  async findAllByNotationId(notationId: string): Promise<Tag[]> {
    return await this.tagRepo.findAllByNotationId(notationId);
  }
}
