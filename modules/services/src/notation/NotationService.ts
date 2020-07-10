import { TYPES } from '@stringsync/container';
import { injectable, inject } from 'inversify';
import { NotationRepo, TagRepo } from '@stringsync/repos';
import { Notation } from '@stringsync/domain';
import { ConnectionArgs, Connection } from '@stringsync/common';

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

  async findPage(connectionArgs: ConnectionArgs): Promise<Connection<Notation>> {
    return await this.notationRepo.findPage(connectionArgs);
  }
}
