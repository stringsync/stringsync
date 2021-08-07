import { EntityManager, LoadStrategy } from '@mikro-orm/core';
import Dataloader from 'dataloader';
import { inject, injectable } from 'inversify';
import { groupBy, mapValues } from 'lodash';
import { Db, TagEntity, TaggingEntity } from '../../db';
import { Tag } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { alignManyToMany, alignOneToOne, ensureNoErrors } from '../../util';
import { TagLoader as ITagLoader } from '../types';
import { em } from './em';

@injectable()
export class TagLoader implements ITagLoader {
  em: EntityManager;

  byIdLoader: Dataloader<string, Tag | null>;
  byNotationIdLoader: Dataloader<string, Tag[]>;

  constructor(@inject(TYPES.Db) private db: Db) {
    this.em = em(db);

    this.byIdLoader = new Dataloader(this.loadByIds);
    this.byNotationIdLoader = new Dataloader(this.loadAllByNotationIds);
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.byIdLoader.load(id);
    this.byIdLoader.clearAll();
    return ensureNoErrors(tag);
  }

  async findAllByNotationId(notationId: string): Promise<Tag[]> {
    const tags = await this.byNotationIdLoader.load(notationId);
    this.byNotationIdLoader.clearAll();
    return ensureNoErrors(tags);
  }

  private loadByIds = async (ids: readonly string[]): Promise<Array<Tag | null>> => {
    const _ids = [...ids];

    const tags = await this.em.find(TagEntity, { id: { $in: _ids } });

    return alignOneToOne(_ids, tags, {
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
      { populate: { tag: LoadStrategy.JOINED } }
    );
    const tags = await Promise.all(taggings.map((tagging) => tagging.tag.load()));

    const taggingsByTagId = groupBy(taggings, 'tagId');
    const notationIdsByTagId = mapValues(taggingsByTagId, (taggings) => taggings.map((tagging) => tagging.notationId));

    return alignManyToMany(_notationIds, tags, {
      getKeys: (tag) => notationIdsByTagId[tag.id] || [],
      getUniqueIdentifier: (tag) => tag.id,
      getMissingValue: () => [],
    });
  };
}
