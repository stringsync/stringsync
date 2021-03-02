import { inject, injectable } from 'inversify';
import { TagModel } from '../../../db';
import { Tag } from '../../../domain';
import { NotFoundError } from '../../../errors';
import { TYPES } from '../../../inversify.constants';
import { TagLoader, TagRepo } from '../../types';

@injectable()
export class SequelizeTagRepo implements TagRepo {
  constructor(@inject(TYPES.TagLoader) public tagLoader: TagLoader) {}

  async count(): Promise<number> {
    return await TagModel.count();
  }

  async validate(tag: Tag): Promise<void> {
    await TagModel.build(tag).validate();
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
