import { inject, injectable } from '@stringsync/di';
import { Tag } from '@stringsync/domain';
import { REPOS, TagRepo } from '@stringsync/repos';

const TYPES = { ...REPOS.TYPES };

@injectable()
export class TagService {
  tagRepo: TagRepo;

  constructor(@inject(TYPES.TagRepo) tagRepo: TagRepo) {
    this.tagRepo = tagRepo;
  }

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
