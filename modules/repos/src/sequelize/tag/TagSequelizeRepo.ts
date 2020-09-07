import { TYPES } from '@stringsync/container';
import { injectable, inject } from 'inversify';
import { TagRepo, TagLoader } from '../../types';
import { TagModel, TaggingModel } from '@stringsync/db';
import { Tag } from '@stringsync/domain';

@injectable()
export class TagSequelizeRepo implements TagRepo {
  tagModel: typeof TagModel;
  taggingModel: typeof TaggingModel;
  tagLoader: TagLoader;

  constructor(
    @inject(TYPES.TagModel) tagModel: typeof TagModel,
    @inject(TYPES.TaggingModel) taggingModel: typeof TaggingModel,
    @inject(TYPES.TagLoader) tagLoader: TagLoader
  ) {
    this.tagModel = tagModel;
    this.taggingModel = taggingModel;
    this.tagLoader = tagLoader;
  }

  async count(): Promise<number> {
    return await this.tagModel.count();
  }

  async create(attrs: Partial<Tag>): Promise<Tag> {
    const tagEntity = await this.tagModel.create(attrs, { raw: true });
    return tagEntity.get({ plain: true }) as Tag;
  }

  async find(id: string): Promise<Tag | null> {
    return await this.tagLoader.findById(id);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagModel.findAll({ raw: true });
  }

  async findAllByNotationId(notationId: string): Promise<Tag[]> {
    return await this.tagLoader.findAllByNotationId(notationId);
  }

  async bulkCreate(bulkAttrs: Partial<Tag>[]): Promise<Tag[]> {
    const tagEntities = await this.tagModel.bulkCreate(bulkAttrs);
    return tagEntities.map((tagEntity: TagModel) => tagEntity.get({ plain: true })) as Tag[];
  }

  async update(id: string, attrs: Partial<Tag>): Promise<void> {
    await this.tagModel.update(attrs, { where: { id } });
  }
}
