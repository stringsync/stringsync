import { sql } from './sql';
import { PagingType } from '@stringsync/common';

export type FindNotationpageQueryArgs = {
  cursor: number;
  pagingType: PagingType;
  limit: number;
  tagIds: string[] | null;
  query: string | null;
};

export const findNotationPageQuery = (args: FindNotationpageQueryArgs): string => {
  const { cursor, tagIds, pagingType, query, limit } = args;
  const isPagingBackward = pagingType === PagingType.BACKWARD;

  const q = sql
    .select('notations.*')
    .from('notations')
    .where('cursor', isPagingBackward ? '<' : '>', cursor)
    .orderBy('notations.cursor', isPagingBackward ? 'desc' : 'asc')
    .limit(limit);

  if (query) {
    q.join('users', 'users.id', 'notations.transcriber_id').where((b) => {
      b.orWhere('notations.song_name', 'ilike', query);
      b.orWhere('notations.artist_name', 'ilike', query);
      b.orWhere('users.username', 'ilike', query);
    });
  }

  if (tagIds) {
    q.leftJoin('taggings', 'taggings.notation_id', 'notations.id')
      .whereIn('taggings.tag_id', tagIds)
      .groupBy('notations.id')
      .having('count(distinct(taggings.tag_id))', '>=', tagIds.length);
  }

  return q.toString();
};
