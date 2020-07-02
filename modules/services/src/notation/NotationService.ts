import Dataloader from 'dataloader';
import { alignOneToMany } from '../dataloader-utils';
import { TYPES } from '@stringsync/container';
import { injectable, inject } from 'inversify';
import { NotationRepo, TagRepo } from '@stringsync/repos';
import { Notation } from '@stringsync/domain';

@injectable()
export class NotationService {
  notationRepo: NotationRepo;
  tagRepo: TagRepo;

  private notationsByTranscriberIdsLoader: Dataloader<string, Notation[]>;

  constructor(@inject(TYPES.NotationRepo) notationRepo: NotationRepo, @inject(TYPES.TagRepo) tagRepo: TagRepo) {
    this.notationRepo = notationRepo;
    this.tagRepo = tagRepo;

    this.notationsByTranscriberIdsLoader = new Dataloader<string, Notation[]>(async (ids) => {
      const notations = await notationRepo.findAllByTranscriberIds([...ids]);
      return alignOneToMany([...ids], notations, {
        getKey: (notation) => notation.transcriberId,
        getUniqueIdentifier: (notation) => notation.id,
        getMissingValue: () => new Array<Notation>(),
      });
    });
  }

  async findByTranscriberId(transcriberId: string): Promise<Notation[]> {
    return await this.notationsByTranscriberIdsLoader.load(transcriberId);
  }
}
