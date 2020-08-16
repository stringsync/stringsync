import { sql } from './sql';

export type FindNotationpageQueryArgs = {
  cursor: number;
  cursorCmp: '<' | '>';
  cursorOrder: 'asc' | 'desc';
  limit: number;
  tagIds: string[] | null;
  query: string | null;
};

export const findNotationPageQuery = (args: FindNotationpageQueryArgs): string => {
  const { cursor, tagIds, query, cursorCmp, cursorOrder, limit } = args;

  const q = sql
    .select('notations.*')
    .from('notations')
    .where('cursor', cursorCmp, cursor)
    .orderBy('notations.cursor', cursorOrder)
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
