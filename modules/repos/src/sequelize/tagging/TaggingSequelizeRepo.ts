import { TYPES } from '@stringsync/container';
import { TaggingModel } from '@stringsync/sequelize';
import { TaggingRepo } from '../../types';
import { inject, injectable } from 'inversify';
import { Tagging } from '@stringsync/domain';

@injectable()
export class TaggingSequelizeRepo implements TaggingRepo {
  taggingModel: typeof TaggingModel;

  constructor(@inject(TYPES.TaggingModel) taggingModel: typeof TaggingModel) {
    this.taggingModel = taggingModel;
  }

  async count(): Promise<number> {
    return await this.taggingModel.count();
  }

  async create(attrs: Partial<Tagging>): Promise<Tagging> {
    const taggingEntity = await this.taggingModel.create(attrs);
    return taggingEntity.get({ plain: true }) as Tagging;
  }

  async find(id: string): Promise<Tagging | null> {
    return await this.taggingModel.findByPk(id, { raw: true });
  }

  async bulkCreate(bulkAttrs: Partial<Tagging>[]): Promise<Tagging[]> {
    const taggingEntites = await this.taggingModel.bulkCreate(bulkAttrs);
    return taggingEntites.map((tagEntity: TaggingModel) => tagEntity.get({ plain: true })) as Tagging[];
  }

  async update(id: string, attrs: Partial<Tagging>): Promise<void> {
    await this.taggingModel.update(attrs, { where: { id } });
  }
}
