import { NotFoundError } from '@stringsync/common';
import { TaggingModel } from '@stringsync/db';
import { Tagging } from '@stringsync/domain';
import { injectable } from 'inversify';
import { TaggingRepo } from '../../types';

@injectable()
export class TaggingSequelizeRepo implements TaggingRepo {
  async count(): Promise<number> {
    return await TaggingModel.count();
  }

  async create(attrs: Partial<Tagging>): Promise<Tagging> {
    const taggingEntity = await TaggingModel.create(attrs);
    return taggingEntity.get({ plain: true }) as Tagging;
  }

  async find(id: string): Promise<Tagging | null> {
    return await TaggingModel.findByPk(id, { raw: true });
  }

  async bulkCreate(bulkAttrs: Partial<Tagging>[]): Promise<Tagging[]> {
    const taggingEntites = await TaggingModel.bulkCreate(bulkAttrs);
    return taggingEntites.map((tagEntity: TaggingModel) => tagEntity.get({ plain: true })) as Tagging[];
  }

  async update(id: string, attrs: Partial<Tagging>): Promise<Tagging> {
    const [_, taggingEntities] = await TaggingModel.update(attrs, { where: { id }, returning: true });
    const taggingEntity = taggingEntities[0];
    if (!taggingEntity) {
      throw new NotFoundError(`tagging not found: ${id}`);
    }
    return taggingEntity.get({ plain: true });
  }
}
