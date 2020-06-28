import { TYPES } from '@stringsync/container';
import { injectable, inject } from 'inversify';
import { TagRepo } from './../types';
import { TagModel } from '@stringsync/sequelize';
import { Tag } from '@stringsync/domain';

@injectable()
export class TagSequelizeRepo implements TagRepo {
  tagModel: typeof TagModel;

  constructor(@inject(TYPES.TagModel) tagModel: typeof TagModel) {
    this.tagModel = tagModel;
  }

  async count(): Promise<number> {
    return await this.tagModel.count();
  }

  async create(attrs: Partial<Tag>): Promise<Tag> {
    const tagModel = await this.tagModel.create(attrs, { raw: true });
    return tagModel.get({ plain: true }) as Tag;
  }

  async find(id: string): Promise<Tag | null> {
    return await this.tagModel.findByPk(id, { raw: true });
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagModel.findAll({ raw: true });
  }

  async bulkCreate(bulkAttrs: Partial<Tag>[]): Promise<Tag[]> {
    const tagModels = await this.tagModel.bulkCreate(bulkAttrs);
    return tagModels.map((tagModel: TagModel) => tagModel.get({ plain: true })) as TagModel[];
  }

  async update(id: string, attrs: Partial<Tag>): Promise<void> {
    await this.tagModel.update(attrs, { where: { id } });
  }
}
