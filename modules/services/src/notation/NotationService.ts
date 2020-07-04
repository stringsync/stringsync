import { TYPES } from '@stringsync/container';
import { injectable, inject } from 'inversify';
import { NotationRepo, TagRepo } from '@stringsync/repos';
import { Notation } from '@stringsync/domain';

@injectable()
export class NotationService {
  notationRepo: NotationRepo;
  tagRepo: TagRepo;

  constructor(@inject(TYPES.NotationRepo) notationRepo: NotationRepo, @inject(TYPES.TagRepo) tagRepo: TagRepo) {
    this.notationRepo = notationRepo;
    this.tagRepo = tagRepo;
  }

  async findAllByTranscriberId(transcriberId: string): Promise<Notation[]> {
    return await this.notationRepo.findAllByTranscriberId(transcriberId);
  }

  async findAllByTagId(tagId: string): Promise<Notation[]> {
    return await this.notationRepo.findAllByTagId(tagId);
  }
}
