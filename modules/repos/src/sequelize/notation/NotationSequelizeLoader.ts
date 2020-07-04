import { NotationLoader } from '../../types';
import Dataloader from 'dataloader';
import { TYPES } from '@stringsync/container';
import { NotationModel, UserModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { Notation } from '@stringsync/domain';
import { alignOneToMany, alignOneToOne, ensureNoErrors } from '../../dataloader-utils';

@injectable()
export class NotationSequelizeLoader implements NotationLoader {
  notationModel: typeof NotationModel;
  userModel: typeof UserModel;

  byIdLoader: Dataloader<string, Notation | null>;
  byTranscriberIdLoader: Dataloader<string, Notation[]>;

  constructor(
    @inject(TYPES.NotationModel) notationModel: typeof NotationModel,
    @inject(TYPES.UserModel) userModel: typeof UserModel
  ) {
    this.notationModel = notationModel;
    this.userModel = userModel;

    this.byIdLoader = new Dataloader(this.loadById);
    this.byTranscriberIdLoader = new Dataloader(this.loadByTranscriberId);
  }

  startListeningForChanges() {
    this.notationModel.emitter.addListener(this.notationModel.PRIME_CACHE, this.primeById);
    this.notationModel.emitter.addListener(this.notationModel.CLEAR_CACHE, this.clearById);

    this.userModel.emitter.addListener(this.userModel.CLEAR_CACHE, this.clearByTranscriberId);
  }

  stopListeningForChanges() {
    this.notationModel.emitter.removeListener(this.notationModel.PRIME_CACHE, this.primeById);
    this.notationModel.emitter.removeListener(this.notationModel.CLEAR_CACHE, this.clearById);

    this.userModel.emitter.removeListener(this.userModel.CLEAR_CACHE, this.clearByTranscriberId);
  }

  async findById(id: string) {
    const notation = this.byIdLoader.load(id);
    return ensureNoErrors(notation);
  }

  async findByTranscriberId(transcriberId: string) {
    const notations = await this.byTranscriberIdLoader.load(transcriberId);
    return ensureNoErrors(notations);
  }

  private loadById = async (ids: readonly string[]): Promise<Array<Notation | null>> => {
    const notations: Notation[] = await this.notationModel.findAll({ where: { id: [...ids] }, raw: true });
    return alignOneToOne([...ids], notations, {
      getKey: (notation) => notation.id,
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => null,
    });
  };

  private loadByTranscriberId = async (transcriberIds: readonly string[]): Promise<Notation[][]> => {
    const notations: Notation[] = await this.notationModel.findAll({
      where: { transcriberId: [...transcriberIds] },
      raw: true,
    });
    return alignOneToMany([...transcriberIds], notations, {
      getKey: (notation) => notation.transcriberId,
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => [],
    });
  };

  private primeById = (id: string, notation: Notation) => {
    this.byIdLoader.prime(id, notation);
  };

  private clearById = (id: string) => {
    this.byIdLoader.clear(id);
  };

  private clearByTranscriberId = (transcriberId: string) => {
    this.byTranscriberIdLoader.clear(transcriberId);
  };
}
