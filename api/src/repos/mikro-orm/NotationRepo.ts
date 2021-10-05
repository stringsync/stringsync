import { EntityManager, LoadStrategy, QueryOrder } from '@mikro-orm/core';
import Dataloader from 'dataloader';
import { inject, injectable } from 'inversify';
import { get, groupBy, mapValues } from 'lodash';
import { Db } from '../../db';
import { NotationEntity, TaggingEntity } from '../../db/mikro-orm';
import { Notation } from '../../domain';
import { NotFoundError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import {
  alignManyToMany,
  alignOneToMany,
  alignOneToOne,
  Connection,
  ensureNoErrors,
  NotationConnectionArgs,
  Pager,
  PagingCtx,
  PagingType,
} from '../../util';
import { findNotationPageMaxQuery, findNotationPageMinQuery, findNotationPageQuery } from '../queries';
import { findSuggestedNotationsQuery } from '../queries/findSuggestedNotationsQuery';
import { NotationRepo as INotationRepo } from '../types';
import { getEntityManager, pojo } from './helpers';

@injectable()
export class NotationRepo implements INotationRepo {
  static pager = new Pager<Notation>(10, 'notation');

  em: EntityManager;

  byIdLoader: Dataloader<string, Notation | null>;
  byTranscriberIdLoader: Dataloader<string, Notation[]>;
  byTagIdLoader: Dataloader<string, Notation[]>;

  constructor(@inject(TYPES.Db) private db: Db) {
    this.em = getEntityManager(this.db);

    this.byIdLoader = new Dataloader(this.loadById);
    this.byTranscriberIdLoader = new Dataloader(this.loadAllByTranscriberId);
    this.byTagIdLoader = new Dataloader(this.loadByTagId);
  }

  async count(): Promise<number> {
    return await this.em.count(NotationEntity);
  }

  async validate(notation: Notation): Promise<void> {
    await new NotationEntity(notation, { em: this.em }).validate();
  }

  async find(id: string): Promise<Notation | null> {
    const notation = await this.byIdLoader.load(id);
    this.byIdLoader.clearAll();
    return ensureNoErrors(notation);
  }

  async findAll(): Promise<Notation[]> {
    const notations = await this.em.find(NotationEntity, {}, { orderBy: { cursor: QueryOrder.DESC } });
    return pojo(notations);
  }

  async findAllByTranscriberId(transcriberId: string): Promise<Notation[]> {
    const notations = await this.byTranscriberIdLoader.load(transcriberId);
    this.byTranscriberIdLoader.clearAll();
    return ensureNoErrors(notations);
  }

  async findAllByTagId(tagId: string): Promise<Notation[]> {
    const notations = await this.byTagIdLoader.load(tagId);
    this.byTagIdLoader.clearAll();
    return ensureNoErrors(notations);
  }

  async create(attrs: Partial<Notation>) {
    const notation = this.em.create(NotationEntity, attrs);
    notation.em = this.em;
    this.em.persist(notation);
    await this.em.flush();
    return pojo(notation);
  }

  async bulkCreate(bulkAttrs: Partial<Notation>[]): Promise<Notation[]> {
    const notations = bulkAttrs.map((attrs) => new NotationEntity(attrs, { em: this.em }));
    this.em.persist(notations);
    await this.em.flush();
    return pojo(notations);
  }

  async update(id: string, attrs: Partial<Notation>): Promise<Notation> {
    const notation = await this.em.findOne(NotationEntity, { id }, { refresh: true });
    if (!notation) {
      throw new NotFoundError('notation not found');
    }
    notation.em = this.em;
    this.em.assign(notation, attrs);
    this.em.persist(notation);
    await this.em.flush();
    return pojo(notation);
  }

  async findPage(args: NotationConnectionArgs): Promise<Connection<Notation>> {
    const tagIds = args.tagIds || null;
    const query = args.query ? `%${args.query}%` : null;

    return await NotationRepo.pager.connect(args, async (pagingCtx: PagingCtx) => {
      const { cursor, limit, pagingType } = pagingCtx;
      const queryArgs = { cursor, pagingType, limit, query, tagIds };

      const [entities, minRows, maxRows] = await Promise.all([
        this.db.query<Notation>(findNotationPageQuery(queryArgs)),
        this.db.query<number>(findNotationPageMinQuery(queryArgs)),
        this.db.query<number>(findNotationPageMaxQuery(queryArgs)),
      ]);

      if (pagingType === PagingType.BACKWARD) {
        entities.reverse();
      }

      const min = get(minRows, '[0].min') || -Infinity;
      const max = get(maxRows, '[0].max') || +Infinity;

      return { entities, min, max };
    });
  }

  async findSuggestions(notation: Notation, limit: number): Promise<Notation[]> {
    const taggings = await this.em.find(TaggingEntity, { notationId: notation.id });
    const tagIds = taggings.map((tagging) => tagging.tagId);
    return await this.db.query<Notation>(findSuggestedNotationsQuery(notation, tagIds, limit));
  }

  private loadById = async (ids: readonly string[]): Promise<Array<Notation | null>> => {
    const _ids = [...ids];

    const notations = await this.em.find(NotationEntity, { id: { $in: _ids } });

    return alignOneToOne(_ids, pojo(notations), {
      getKey: (notation) => notation.id,
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => null,
    });
  };

  private loadAllByTranscriberId = async (transcriberIds: readonly string[]): Promise<Notation[][]> => {
    const _transcriberIds = [...transcriberIds];

    const notations = await this.em.find(
      NotationEntity,
      { transcriberId: { $in: _transcriberIds } },
      { refresh: true }
    );

    return alignOneToMany(_transcriberIds, pojo(notations), {
      getKey: (notation) => notation.transcriberId,
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => [],
    });
  };

  private loadByTagId = async (tagIds: readonly string[]): Promise<Notation[][]> => {
    const _tagIds = [...tagIds];

    const taggings = await this.em.find(
      TaggingEntity,
      { tagId: _tagIds },
      { populate: { notation: LoadStrategy.JOINED }, refresh: true }
    );
    const notations = await Promise.all(taggings.map((tagging) => tagging.notation.load()));

    const taggingsByNotationId = groupBy(taggings, 'notationId');
    const tagIdsByNotationId = mapValues(taggingsByNotationId, (taggings) => taggings.map((tagging) => tagging.tagId));

    return alignManyToMany([...tagIds], pojo(notations), {
      getKeys: (notation) => tagIdsByNotationId[notation.id] || [],
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => [],
    });
  };
}
