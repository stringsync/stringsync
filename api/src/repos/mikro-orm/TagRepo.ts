import { EntityManager } from '@mikro-orm/core';
import { inject, injectable } from 'inversify';
import { Db } from '../../db';
import { TagEntity } from '../../db/mikro-orm';
import { Tag } from '../../domain';
import { NotFoundError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { TagLoader, TagRepo as ITagRepo } from '../types';
import { getEntityManager } from './getEntityManager';
import { pojo } from './pojo';

@injectable()
export class TagRepo implements ITagRepo {
  em: EntityManager;

  constructor(@inject(TYPES.TagLoader) private tagLoader: TagLoader, @inject(TYPES.Db) private db: Db) {
    this.em = getEntityManager(this.db);
  }

  async count(): Promise<number> {
    return await this.em.count(TagEntity);
  }

  async validate(tag: Tag): Promise<void> {
    await new TagEntity(tag).validate();
  }

  async create(attrs: Partial<Tag>): Promise<Tag> {
    const tag = this.em.create(TagEntity, attrs);

    this.em.persist(tag);
    await this.em.flush();

    return pojo(tag);
  }

  async find(id: string): Promise<Tag | null> {
    return await this.tagLoader.findById(id);
  }

  async findAll(): Promise<Tag[]> {
    const tags = await this.em.find(TagEntity, {});
    return pojo(tags);
  }

  async findAllByNotationId(notationId: string): Promise<Tag[]> {
    return await this.tagLoader.findAllByNotationId(notationId);
  }

  async bulkCreate(bulkAttrs: Partial<Tag>[]): Promise<Tag[]> {
    const tags = bulkAttrs.map((attrs) => new TagEntity(attrs));
    this.em.persist(tags);
    await this.em.flush();
    return pojo(tags);
  }

  async update(id: string, attrs: Partial<Tag>): Promise<Tag> {
    const tag = await this.em.findOne(TagEntity, { id });
    if (!tag) {
      throw new NotFoundError('tag not found');
    }
    this.em.assign(tag, attrs);
    this.em.persist(tag);
    await this.em.flush();
    return pojo(tag);
  }
}
