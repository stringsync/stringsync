import { Knex } from 'knex';
import { PagingType } from '../../util';
import { sql } from './sql';

export type FindNotationPageQueryArgs = {
  cursor: number;
  pagingType: PagingType;
  limit: number;
  tagIds: string[] | null;
  query: string | null;
};

const applyQuery = (b: Knex.QueryBuilder, query: string | null) => {
  if (query) {
    b.join('users', 'users.id', 'notations.transcriber_id').where((b) => {
      b.orWhere('notations.song_name', 'ilike', query);
      b.orWhere('notations.artist_name', 'ilike', query);
      b.orWhere('users.username', 'ilike', query);
    });
  }
};

const applyTagIds = (b: Knex.QueryBuilder, tagIds: string[] | null) => {
  if (tagIds) {
    b.leftJoin('notation_tags', 'notation_tags.notation_id', 'notations.id')
      .whereIn('notation_tags.tag_id', tagIds)
      .groupBy('notations.id')
      .having(sql.raw('count(distinct(notation_tags.tag_id)) >= ?', tagIds.length));
  }
};

export const findNotationPageQuery = (args: FindNotationPageQueryArgs): string => {
  const { cursor, tagIds, pagingType, query, limit } = args;
  const isPagingBackward = pagingType === PagingType.BACKWARD;

  const b = sql
    .select('notations.*')
    .from('notations')
    .where('notations.cursor', isPagingBackward ? '<' : '>', cursor)
    .where('notations.private', '=', false)
    .orderBy('notations.cursor', isPagingBackward ? 'desc' : 'asc')
    .limit(limit);

  applyQuery(b, query);
  applyTagIds(b, tagIds);

  return b.toString();
};

export const findNotationPageMinQuery = (args: FindNotationPageQueryArgs): string => {
  const { tagIds, query } = args;
  const b = sql.select('notations.cursor').from('notations').as('cursors');
  applyQuery(b, query);
  applyTagIds(b, tagIds);
  return sql.min('cursors.cursor').from(b).toString();
};

export const findNotationPageMaxQuery = (args: FindNotationPageQueryArgs): string => {
  const { tagIds, query } = args;
  const b = sql.select('notations.cursor').from('notations').as('cursors');
  applyQuery(b, query);
  applyTagIds(b, tagIds);
  return sql.max('cursors.cursor').from(b).toString();
};
