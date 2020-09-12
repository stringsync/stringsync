import { Connection, NotationConnectionArgs } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { Notation } from '@stringsync/domain';
import { NotationRepo, TagRepo } from '@stringsync/repos';
import { inject, injectable } from 'inversify';

@injectable()
export class NotationService {
  notationRepo: NotationRepo;
  tagRepo: TagRepo;

  constructor(@inject(TYPES.NotationRepo) notationRepo: NotationRepo, @inject(TYPES.TagRepo) tagRepo: TagRepo) {
    this.notationRepo = notationRepo;
    this.tagRepo = tagRepo;
  }

  async find(id: string): Promise<Notation | null> {
    return await this.notationRepo.find(id);
  }

  async findAllByTranscriberId(transcriberId: string): Promise<Notation[]> {
    return await this.notationRepo.findAllByTranscriberId(transcriberId);
  }

  async findAllByTagId(tagId: string): Promise<Notation[]> {
    return await this.notationRepo.findAllByTagId(tagId);
  }

  async findPage(args: NotationConnectionArgs): Promise<Connection<Notation>> {
    return await this.notationRepo.findPage(args);
  }

  async create(songName: string, artistName: string, transcriberId: string): Promise<Notation> {
    return await this.notationRepo.create({ songName, artistName, transcriberId });
  }

  async update(id: string, attrs: Notation): Promise<void> {
    await this.notationRepo.update(id, attrs);
  }
}
