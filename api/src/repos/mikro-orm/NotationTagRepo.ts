import { EntityManager } from '@mikro-orm/core';
import { inject, injectable } from 'inversify';
import { Db } from '../../db';
import { NotationTagEntity } from '../../db/mikro-orm';
import { NotationTag } from '../../domain';
import { NotFoundError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { NotationTagRepo as INotationTagRepo } from '../types';
import { getEntityManager, pojo } from './helpers';

@injectable()
export class NotationTagRepo implements INotationTagRepo {
  em: EntityManager;

  constructor(@inject(TYPES.Db) private db: Db) {
    this.em = getEntityManager(this.db);
  }

  async count(): Promise<number> {
    return await this.em.count(NotationTagEntity);
  }

  async validate(notationTag: NotationTag): Promise<void> {
    await new NotationTagEntity(notationTag, { em: this.em }).validate();
  }

  async create(attrs: Partial<NotationTag>): Promise<NotationTag> {
    const notationTag = this.em.create(NotationTagEntity, attrs);
    notationTag.em = this.em;
    this.em.persist(notationTag);
    await this.em.flush();
    return pojo(notationTag);
  }

  async find(id: string): Promise<NotationTag | null> {
    const notationTag = await this.em.findOne(NotationTagEntity, { id });
    return notationTag ? pojo(notationTag) : null;
  }

  async bulkCreate(bulkAttrs: Partial<NotationTag>[]): Promise<NotationTag[]> {
    const notationTags = bulkAttrs.map((attrs) => new NotationTagEntity(attrs, { em: this.em }));
    this.em.persist(notationTags);
    await this.em.flush();
    return pojo(notationTags);
  }

  async update(id: string, attrs: Partial<NotationTag>): Promise<NotationTag> {
    const notationTag = await this.em.findOne(NotationTagEntity, { id });
    if (!notationTag) {
      throw new NotFoundError('notation tag not found');
    }
    notationTag.em = this.em;
    this.em.assign(notationTag, attrs);
    this.em.persist(notationTag);
    await this.em.flush();
    return pojo(notationTag);
  }
}
