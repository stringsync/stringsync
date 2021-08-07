import { EntityManager } from '@mikro-orm/core';
import { inject, injectable } from 'inversify';
import { Db, TaggingEntity } from '../../db';
import { Tagging } from '../../domain';
import { NotFoundError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { TaggingRepo as ITaggingRepo } from '../types';
import { em } from './em';

@injectable()
export class TaggingRepo implements ITaggingRepo {
  em: EntityManager;

  constructor(@inject(TYPES.Db) private db: Db) {
    this.em = em(this.db);
  }

  async count(): Promise<number> {
    return await this.em.count(TaggingEntity);
  }

  async validate(tagging: Tagging): Promise<void> {
    await new TaggingEntity(tagging).validate();
  }

  async create(attrs: Partial<Tagging>): Promise<Tagging> {
    return this.em.create(TaggingEntity, attrs);
  }

  async find(id: string): Promise<Tagging | null> {
    return this.em.findOne(TaggingEntity, { id });
  }

  async bulkCreate(bulkAttrs: Partial<Tagging>[]): Promise<Tagging[]> {
    const taggings = bulkAttrs.map((attrs) => new TaggingEntity(attrs));
    this.em.persist(taggings);
    await this.em.flush();
    return taggings;
  }

  async update(id: string, attrs: Partial<Tagging>): Promise<Tagging> {
    const tagging = await this.find(id);
    if (!tagging) {
      throw new NotFoundError('tagging not found');
    }
    this.em.assign(tagging, attrs);
    this.em.persist(tagging);
    await this.em.flush();
    return tagging;
  }
}
