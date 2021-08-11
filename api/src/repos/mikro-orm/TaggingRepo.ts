import { EntityManager } from '@mikro-orm/core';
import { inject, injectable } from 'inversify';
import { Db } from '../../db';
import { TaggingEntity } from '../../db/mikro-orm';
import { Tagging } from '../../domain';
import { NotFoundError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { TaggingRepo as ITaggingRepo } from '../types';
import { getEntityManager, pojo } from './helpers';

@injectable()
export class TaggingRepo implements ITaggingRepo {
  em: EntityManager;

  constructor(@inject(TYPES.Db) private db: Db) {
    this.em = getEntityManager(this.db);
  }

  async count(): Promise<number> {
    return await this.em.count(TaggingEntity);
  }

  async validate(tagging: Tagging): Promise<void> {
    await new TaggingEntity(tagging).validate();
  }

  async create(attrs: Partial<Tagging>): Promise<Tagging> {
    const tagging = this.em.create(TaggingEntity, attrs);
    this.em.persist(tagging);
    await this.em.flush();
    return pojo(tagging);
  }

  async find(id: string): Promise<Tagging | null> {
    const tagging = await this.em.findOne(TaggingEntity, { id });
    return tagging ? pojo(tagging) : null;
  }

  async bulkCreate(bulkAttrs: Partial<Tagging>[]): Promise<Tagging[]> {
    const taggings = bulkAttrs.map((attrs) => new TaggingEntity(attrs));
    this.em.persist(taggings);
    await this.em.flush();
    return pojo(taggings);
  }

  async update(id: string, attrs: Partial<Tagging>): Promise<Tagging> {
    const tagging = await this.em.findOne(TaggingEntity, { id });
    if (!tagging) {
      throw new NotFoundError('tagging not found');
    }
    this.em.assign(tagging, attrs);
    this.em.persist(tagging);
    await this.em.flush();
    return pojo(tagging);
  }
}
