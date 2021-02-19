import Dataloader from 'dataloader';
import { injectable } from 'inversify';
import { groupBy, mapValues } from 'lodash';
import { NotationModel, TaggingModel } from '../../../db';
import { Notation, Tagging } from '../../../domain';
import { alignManyToMany, alignOneToMany, alignOneToOne, ensureNoErrors } from '../../../util';
import { NotationLoader } from '../../types';

@injectable()
export class SequelizeNotationLoader implements NotationLoader {
  byIdLoader: Dataloader<string, Notation | null>;
  byTranscriberIdLoader: Dataloader<string, Notation[]>;
  byTagIdLoader: Dataloader<string, Notation[]>;

  constructor() {
    this.byIdLoader = new Dataloader(this.loadById);
    this.byTranscriberIdLoader = new Dataloader(this.loadAllByTranscriberId);
    this.byTagIdLoader = new Dataloader(this.loadByTagId);
  }

  async findById(id: string) {
    const notation = this.byIdLoader.load(id);
    this.byIdLoader.clearAll();
    return ensureNoErrors(notation);
  }

  async findAllByTranscriberId(transcriberId: string) {
    const notations = await this.byTranscriberIdLoader.load(transcriberId);
    this.byTranscriberIdLoader.clearAll();
    return ensureNoErrors(notations);
  }

  async findAllByTagId(tagId: string) {
    const notations = await this.byTagIdLoader.load(tagId);
    this.byTagIdLoader.clearAll();
    return ensureNoErrors(notations);
  }

  private loadById = async (ids: readonly string[]): Promise<Array<Notation | null>> => {
    const notations: Notation[] = await NotationModel.findAll({ where: { id: [...ids] }, raw: true });
    return alignOneToOne([...ids], notations, {
      getKey: (notation) => notation.id,
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => null,
    });
  };

  private loadAllByTranscriberId = async (transcriberIds: readonly string[]): Promise<Notation[][]> => {
    const notations: Notation[] = await NotationModel.findAll({
      where: { transcriberId: [...transcriberIds] },
      raw: true,
    });
    return alignOneToMany([...transcriberIds], notations, {
      getKey: (notation) => notation.transcriberId,
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => [],
    });
  };

  private loadByTagId = async (tagIds: readonly string[]): Promise<Notation[][]> => {
    const taggingModels = await TaggingModel.findAll({
      where: { tagId: [...tagIds] },
      include: [{ model: NotationModel as any, as: 'notation', required: true }],
    });
    const notationModels = taggingModels.map((tagging) => tagging.notation!);

    const taggings = taggingModels.map<Tagging>((taggingModel) => taggingModel.get({ plain: true }));
    const notations = notationModels.map<Notation>((notationModel: NotationModel) =>
      notationModel.get({ plain: true })
    );

    const taggingsByNotationId = groupBy(taggings, 'notationId');
    const tagIdsByNotationId = mapValues(taggingsByNotationId, (taggings) => taggings.map((tagging) => tagging.tagId));

    return alignManyToMany([...tagIds], notations, {
      getKeys: (notation) => tagIdsByNotationId[notation.id] || [],
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => [],
    });
  };
}
