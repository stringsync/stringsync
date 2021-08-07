import { EntityManager, LoadStrategy } from '@mikro-orm/core';
import Dataloader from 'dataloader';
import { inject, injectable } from 'inversify';
import { groupBy, mapValues } from 'lodash';
import { Db, NotationEntity, TaggingEntity } from '../../db';
import { Notation } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { alignManyToMany, alignOneToMany, alignOneToOne, ensureNoErrors } from '../../util';
import { NotationLoader as INotationLoader } from '../types';
import { em } from './em';

@injectable()
export class NotationLoader implements INotationLoader {
  em: EntityManager;

  byIdLoader: Dataloader<string, Notation | null>;
  byTranscriberIdLoader: Dataloader<string, Notation[]>;
  byTagIdLoader: Dataloader<string, Notation[]>;

  constructor(@inject(TYPES.Db) public db: Db) {
    this.em = em(db);

    this.byIdLoader = new Dataloader(this.loadById);
    this.byTranscriberIdLoader = new Dataloader(this.loadAllByTranscriberId);
    this.byTagIdLoader = new Dataloader(this.loadByTagId);
  }

  async findById(id: string) {
    const notation = await this.byIdLoader.load(id);
    this.byIdLoader.clearAll();
    return ensureNoErrors(notation);
  }

  async findAllByTranscriberId(transcriberId: string) {
    const notations = await this.byTranscriberIdLoader.load(transcriberId);
    this.byTranscriberIdLoader.clearAll();
    return ensureNoErrors(notations);
  }

  async findAllByTagId(tagId: string) {
    const notations = await this.byTagIdLoader.load(tagId);
    this.byTagIdLoader.clearAll();
    return ensureNoErrors(notations);
  }

  private loadById = async (ids: readonly string[]): Promise<Array<Notation | null>> => {
    const _ids = [...ids];

    const notations = await this.em.find(NotationEntity, { id: { $in: _ids } });

    return alignOneToOne(_ids, notations, {
      getKey: (notation) => notation.id,
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => null,
    });
  };

  private loadAllByTranscriberId = async (transcriberIds: readonly string[]): Promise<Notation[][]> => {
    const _transcriberIds = [...transcriberIds];

    const notations = await this.em.find(NotationEntity, { transcriberId: { $in: _transcriberIds } });

    return alignOneToMany(_transcriberIds, notations, {
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
      { populate: { notation: LoadStrategy.JOINED } }
    );
    const notations = await Promise.all(taggings.map((tagging) => tagging.notation.load()));

    const taggingsByNotationId = groupBy(taggings, 'notationId');
    const tagIdsByNotationId = mapValues(taggingsByNotationId, (taggings) => taggings.map((tagging) => tagging.tagId));

    return alignManyToMany([...tagIds], notations, {
      getKeys: (notation) => tagIdsByNotationId[notation.id] || [],
      getUniqueIdentifier: (notation) => notation.id,
      getMissingValue: () => [],
    });
  };
}
