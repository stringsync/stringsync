import { NotationLoader } from '../../types';
import Dataloader from 'dataloader';
import { TYPES } from '@stringsync/container';
import { NotationModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { Notation } from '@stringsync/domain';
import { alignOneToMany, ensureNoErrors } from '../../dataloader-utils';

@injectable()
export class NotationSequelizeLoader implements NotationLoader {
  notationModel: typeof NotationModel;

  byTranscriberIdLoader: Dataloader<string, Notation[]>;

  constructor(@inject(TYPES.NotationModel) notationModel: typeof NotationModel) {
    this.notationModel = notationModel;

    this.byTranscriberIdLoader = new Dataloader(this.loadByTranscriberId.bind(this));
  }

  primeByTranscriberId(transcriberId: string, notations: Notation[]) {
    this.byTranscriberIdLoader.prime(transcriberId, notations);
  }

  clearByTranscriberId(transcriberId: string) {
    this.byTranscriberIdLoader.clear(transcriberId);
  }

  async findByTranscriberId(transcriberId: string): Promise<Notation[]> {
    const notations = await this.byTranscriberIdLoader.load(transcriberId);
    return ensureNoErrors(notations);
  }

  private async loadByTranscriberId(transcriberIds: readonly string[]): Promise<Notation[][]> {
    const notations: Notation[] = await this.notationModel.findAll({
      where: { transcriberId: [...transcriberIds] },
      raw: true,
    });
    return alignOneToMany([...transcriberIds], notations, {
      getKey: (notation) => notation.transcriberId,
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => [],
    });
  }
}
