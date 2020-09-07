import { groupBy, mapValues } from 'lodash';
import { NotationLoader } from '../../types';
import Dataloader from 'dataloader';
import { TYPES } from '@stringsync/container';
import { NotationModel, UserModel, TaggingModel } from '@stringsync/db';
import { inject, injectable } from 'inversify';
import { Notation, Tagging } from '@stringsync/domain';
import { alignOneToMany, alignOneToOne, ensureNoErrors, alignManyToMany } from '../../util';

@injectable()
export class NotationSequelizeLoader implements NotationLoader {
  notationModel: typeof NotationModel;
  userModel: typeof UserModel;
  taggingModel: typeof TaggingModel;

  byIdLoader: Dataloader<string, Notation | null>;
  byTranscriberIdLoader: Dataloader<string, Notation[]>;
  byTagIdLoader: Dataloader<string, Notation[]>;

  constructor(
    @inject(TYPES.NotationModel) notationModel: typeof NotationModel,
    @inject(TYPES.UserModel) userModel: typeof UserModel,
    @inject(TYPES.TaggingModel) taggingModel: typeof TaggingModel
  ) {
    this.notationModel = notationModel;
    this.userModel = userModel;
    this.taggingModel = taggingModel;

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
    const notations: Notation[] = await this.notationModel.findAll({ where: { id: [...ids] }, raw: true });
    return alignOneToOne([...ids], notations, {
      getKey: (notation) => notation.id,
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => null,
    });
  };

  private loadAllByTranscriberId = async (transcriberIds: readonly string[]): Promise<Notation[][]> => {
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

  private loadByTagId = async (tagIds: readonly string[]): Promise<Notation[][]> => {
    const taggingEntities = await this.taggingModel.findAll({
      where: { tagId: [...tagIds] },
      include: [{ model: this.notationModel, required: true }],
    });
    const notationEntities = taggingEntities.map((tagging) => tagging.notation);

    const taggings = taggingEntities.map((taggingEntity) => taggingEntity.get({ plain: true })) as Tagging[];
    const notations = notationEntities.map((notationEntity) => notationEntity.get({ plain: true })) as Notation[];

    const taggingsByNotationId = groupBy(taggings, 'notationId');
    const tagIdsByNotationId = mapValues(taggingsByNotationId, (taggings) => taggings.map((tagging) => tagging.tagId));

    return alignManyToMany([...tagIds], notations, {
      getKeys: (notation) => tagIdsByNotationId[notation.id] || [],
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => [],
    });
  };
}
