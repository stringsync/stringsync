import { NotationLoader } from '../../types';
import Dataloader from 'dataloader';
import { TYPES } from '@stringsync/container';
import { NotationModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { Notation } from '@stringsync/domain';
import { alignOneToMany, alignOneToOne, ensureNoErrors } from '../../dataloader-utils';

@injectable()
export class NotationSequelizeLoader implements NotationLoader {
  notationModel: typeof NotationModel;

  byIdLoader: Dataloader<string, Notation | null>;
  byTranscriberIdLoader: Dataloader<string, Notation[]>;

  constructor(@inject(TYPES.NotationModel) notationModel: typeof NotationModel) {
    this.notationModel = notationModel;

    this.byIdLoader = new Dataloader(this.loadById.bind(this));
    this.byTranscriberIdLoader = new Dataloader(this.loadByTranscriberId.bind(this));
  }

  async findById(id: string) {
    const notation = this.byIdLoader.load(id);
    this.byIdLoader.clearAll();
    return ensureNoErrors(notation);
  }

  async findByTranscriberId(transcriberId: string) {
    const notations = await this.byTranscriberIdLoader.load(transcriberId);
    this.byTranscriberIdLoader.clearAll();
    return ensureNoErrors(notations);
  }

  private async loadById(ids: readonly string[]): Promise<Array<Notation | null>> {
    const notations: Notation[] = await this.notationModel.findAll({ where: { id: [...ids] }, raw: true });
    return alignOneToOne([...ids], notations, {
      getKey: (notation) => notation.id,
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => null,
    });
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
