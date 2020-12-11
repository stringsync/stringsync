import { inject, injectable } from '@stringsync/di';
import { Tag } from '@stringsync/domain';
import { REPOS_TYPES, TagRepo } from '@stringsync/repos';

const TYPES = { ...REPOS_TYPES };

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
