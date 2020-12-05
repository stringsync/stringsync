import { NotFoundError } from '@stringsync/common';
import { TagModel } from '@stringsync/db';
import { TYPES } from '@stringsync/di';
import { Tag } from '@stringsync/domain';
import { inject, injectable } from 'inversify';
import { TagLoader, TagRepo } from '../../types';

@injectable()
export class TagSequelizeRepo implements TagRepo {
  tagLoader: TagLoader;

  constructor(@inject(TYPES.TagLoader) tagLoader: TagLoader) {
    this.tagLoader = tagLoader;
  }

  async count(): Promise<number> {
    return await TagModel.count();
  }

  async create(attrs: Partial<Tag>): Promise<Tag> {
    const tagEntity = await TagModel.create(attrs);
    return tagEntity.get({ plain: true }) as Tag;
  }

  async find(id: string): Promise<Tag | null> {
    return await this.tagLoader.findById(id);
  }

  async findAll(): Promise<Tag[]> {
    return await TagModel.findAll({ raw: true });
  }

  async findAllByNotationId(notationId: string): Promise<Tag[]> {
    return await this.tagLoader.findAllByNotationId(notationId);
  }

  async bulkCreate(bulkAttrs: Partial<Tag>[]): Promise<Tag[]> {
    const tagEntities = await TagModel.bulkCreate(bulkAttrs);
    return tagEntities.map((tagEntity: TagModel) => tagEntity.get({ plain: true })) as Tag[];
  }

  async update(id: string, attrs: Partial<Tag>): Promise<Tag> {
    const tagEntity = await TagModel.findByPk(id);
    if (!tagEntity) {
      throw new NotFoundError('tag not found');
    }
    await tagEntity.update(attrs);
    return tagEntity.get({ plain: true });
  }
}
