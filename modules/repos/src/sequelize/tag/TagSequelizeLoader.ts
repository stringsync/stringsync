import { ensureNoErrors, alignManyToMany, alignOneToOne } from './../../util';
import { TagLoader } from '../../types';
import Dataloader from 'dataloader';
import { TYPES } from '@stringsync/container';
import { TagModel, TaggingModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { Tag, Tagging } from '@stringsync/domain';
import { mapValues, groupBy } from 'lodash';

@injectable()
export class TagSequelizeLoader implements TagLoader {
  tagModel: typeof TagModel;
  taggingModel: typeof TaggingModel;

  byIdLoader: Dataloader<string, Tag | null>;
  byNotationIdLoader: Dataloader<string, Tag[]>;

  constructor(
    @inject(TYPES.TagModel) tagModel: typeof TagModel,
    @inject(TYPES.TaggingModel) taggingModel: typeof TaggingModel
  ) {
    this.tagModel = tagModel;
    this.taggingModel = taggingModel;

    this.byIdLoader = new Dataloader(this.loadByIds);
    this.byNotationIdLoader = new Dataloader(this.loadAllByNotationIds);
  }

  startListeningForChanges(): void {
    this.tagModel.emitter.addListener(this.tagModel.PRIME_CACHE, this.primeById);
    this.tagModel.emitter.addListener(this.tagModel.CLEAR_CACHE, this.clearById);
  }

  stopListeningForChanges(): void {
    this.tagModel.emitter.removeListener(this.tagModel.PRIME_CACHE, this.primeById);
    this.tagModel.emitter.removeListener(this.tagModel.CLEAR_CACHE, this.clearById);
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.byIdLoader.load(id);
    return ensureNoErrors(tag);
  }

  async findAllByNotationId(notationId: string): Promise<Tag[]> {
    const tags = await this.byNotationIdLoader.load(notationId);
    return ensureNoErrors(tags);
  }

  private loadByIds = async (ids: readonly string[]): Promise<Array<Tag | null>> => {
    const tags = await this.tagModel.findAll({ where: { id: [...ids] }, raw: true });
    return alignOneToOne([...ids], tags, {
      getKey: (tag) => tag.id,
      getUniqueIdentifier: (tag) => tag.id,
      getMissingValue: () => null,
    });
  };

  private loadAllByNotationIds = async (notationIds: readonly string[]): Promise<Tag[][]> => {
    const taggingEntities = await this.taggingModel.findAll({
      where: { notationId: [...notationIds] },
      include: [{ model: this.tagModel, required: true }],
    });
    const tagEntities = taggingEntities.map((tagging) => tagging.tag);

    const taggings = taggingEntities.map((taggingEntity) => taggingEntity.get({ plain: true })) as Tagging[];
    const tags = tagEntities.map((tagEntity) => tagEntity.get({ plain: true })) as Tag[];

    const taggingsByTagId = groupBy(taggings, 'tagId');
    const notationIdsByTagId = mapValues(taggingsByTagId, (taggings) => taggings.map((tagging) => tagging.notationId));

    return alignManyToMany([...notationIds], tags, {
      getKeys: (tag) => notationIdsByTagId[tag.id] || [],
      getUniqueIdentifier: (tag) => tag.id,
      getMissingValue: () => [],
    });
  };

  private primeById = (notationId: string, tags: Tag[]) => {
    this.byNotationIdLoader.prime(notationId, tags);
  };

  private clearById = (notationId: string) => {
    this.byNotationIdLoader.clear(notationId);
  };
}
