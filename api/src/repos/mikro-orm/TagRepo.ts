import { EntityManager, LoadStrategy } from '@mikro-orm/core';
import Dataloader from 'dataloader';
import { inject, injectable } from 'inversify';
import { groupBy, mapValues } from 'lodash';
import { Db } from '../../db';
import { TagEntity, TaggingEntity } from '../../db/mikro-orm';
import { Tag } from '../../domain';
import { NotFoundError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { alignManyToMany, alignOneToOne, ensureNoErrors } from '../../util';
import { TagRepo as ITagRepo } from '../types';
import { getEntityManager, pojo } from './helpers';

@injectable()
export class TagRepo implements ITagRepo {
  em: EntityManager;

  byIdLoader: Dataloader<string, Tag | null>;
  byNotationIdLoader: Dataloader<string, Tag[]>;

  constructor(@inject(TYPES.Db) private db: Db) {
    this.em = getEntityManager(this.db);
    this.byIdLoader = new Dataloader(this.loadByIds);
    this.byNotationIdLoader = new Dataloader(this.loadAllByNotationIds);
  }

  async count(): Promise<number> {
    return await this.em.count(TagEntity);
  }

  async validate(tag: Tag): Promise<void> {
    await new TagEntity(tag, { em: this.em }).validate();
  }

  async create(attrs: Partial<Tag>): Promise<Tag> {
    const tag = this.em.create(TagEntity, attrs);
    tag.em = this.em;
    this.em.persist(tag);
    await this.em.flush();
    return pojo(tag);
  }

  async find(id: string): Promise<Tag | null> {
    const tag = await this.byIdLoader.load(id);
    this.byIdLoader.clearAll();
    return ensureNoErrors(tag);
  }

  async findAll(): Promise<Tag[]> {
    const tags = await this.em.find(TagEntity, {});
    return pojo(tags);
  }

  async findAllByNotationId(notationId: string): Promise<Tag[]> {
    const tags = await this.byNotationIdLoader.load(notationId);
    this.byNotationIdLoader.clearAll();
    return ensureNoErrors(tags);
  }

  async bulkCreate(bulkAttrs: Partial<Tag>[]): Promise<Tag[]> {
    const tags = bulkAttrs.map((attrs) => new TagEntity(attrs, { em: this.em }));
    this.em.persist(tags);
    await this.em.flush();
    return pojo(tags);
  }

  async update(id: string, attrs: Partial<Tag>): Promise<Tag> {
    const tag = await this.em.findOne(TagEntity, { id });
    if (!tag) {
      throw new NotFoundError('tag not found');
    }
    tag.em = this.em;
    this.em.assign(tag, attrs);
    this.em.persist(tag);
    await this.em.flush();
    return pojo(tag);
  }

  private loadByIds = async (ids: readonly string[]): Promise<Array<Tag | null>> => {
    const _ids = [...ids];

    const tags = await this.em.find(TagEntity, { id: { $in: _ids } });

    return alignOneToOne(_ids, pojo(tags), {
      getKey: (tag) => tag.id,
      getUniqueIdentifier: (tag) => tag.id,
      getMissingValue: () => null,
    });
  };

  private loadAllByNotationIds = async (notationIds: readonly string[]): Promise<Tag[][]> => {
    const _notationIds = [...notationIds];

    const taggings = await this.em.find(
      TaggingEntity,
      { notationId: { $in: _notationIds } },
      { populate: { tag: LoadStrategy.JOINED }, refresh: true }
    );
    const tags = await Promise.all(taggings.map((tagging) => tagging.tag.load()));

    const taggingsByTagId = groupBy(taggings, 'tagId');
    const notationIdsByTagId = mapValues(taggingsByTagId, (taggings) => taggings.map((tagging) => tagging.notationId));

    return alignManyToMany(_notationIds, pojo(tags), {
      getKeys: (tag) => notationIdsByTagId[tag.id] || [],
      getUniqueIdentifier: (tag) => tag.id,
      getMissingValue: () => [],
    });
  };
}
