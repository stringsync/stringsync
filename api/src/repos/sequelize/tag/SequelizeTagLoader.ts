import Dataloader from 'dataloader';
import { injectable } from 'inversify';
import { groupBy, mapValues } from 'lodash';
import { TaggingModel, TagModel } from '../../../db';
import { Tag } from '../../../domain';
import { alignManyToMany, alignOneToOne, ensureNoErrors } from '../../../util';
import { TagLoader } from '../../types';

@injectable()
export class TagSequelizeLoader implements TagLoader {
  byIdLoader: Dataloader<string, Tag | null>;
  byNotationIdLoader: Dataloader<string, Tag[]>;

  constructor() {
    this.byIdLoader = new Dataloader(this.loadByIds);
    this.byNotationIdLoader = new Dataloader(this.loadAllByNotationIds);
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.byIdLoader.load(id);
    this.byIdLoader.clearAll();
    return ensureNoErrors(tag);
  }

  async findAllByNotationId(notationId: string): Promise<Tag[]> {
    const tags = await this.byNotationIdLoader.load(notationId);
    this.byNotationIdLoader.clearAll();
    return ensureNoErrors(tags);
  }

  private loadByIds = async (ids: readonly string[]): Promise<Array<Tag | null>> => {
    const tags = await TagModel.findAll({ where: { id: [...ids] }, raw: true });
    return alignOneToOne([...ids], tags, {
      getKey: (tag) => tag.id,
      getUniqueIdentifier: (tag) => tag.id,
      getMissingValue: () => null,
    });
  };

  private loadAllByNotationIds = async (notationIds: readonly string[]): Promise<Tag[][]> => {
    const taggingDaos = await TaggingModel.findAll({
      where: { notationId: [...notationIds] },
      include: [{ model: TagModel as any, as: 'tag', required: true }],
    });
    const tagDaos = taggingDaos.map((taggingDao: TaggingModel) => taggingDao.tag!);

    const taggings = taggingDaos.map((taggingDao: TaggingModel) => taggingDao.get({ plain: true })) as Tagging[];
    const tags = tagDaos.map((tagDao: TagModel) => tagDao.get({ plain: true })) as Tag[];

    const taggingsByTagId = groupBy(taggings, 'tagId');
    const notationIdsByTagId = mapValues(taggingsByTagId, (taggings) => taggings.map((tagging) => tagging.notationId));

    return alignManyToMany([...notationIds], tags, {
      getKeys: (tag) => notationIdsByTagId[tag.id] || [],
      getUniqueIdentifier: (tag) => tag.id,
      getMissingValue: () => [],
    });
  };
}
