import { Notation } from '../../domain';
import { sql } from './sql';

export const findSuggestedNotationsQuery = (notation: Notation, tagIds: string[], limit: number): string => {
  return sql
    .select('notations.*')
    .from('notations')
    .join('taggings', 'taggings.notation_id', 'notations.id')
    .where('notations.private', '=', false)
    .where((b) => {
      b.orWhere('notations.artist_name', '=', notation.artistName);
      b.orWhereIn('taggings.tag_id', tagIds);
    })
    .groupBy('notations.id')
    .orderByRaw(
      '(count(distinct(taggings.tag_id)), case when notations.artist_name = ? then 1 else 0 end, random()) desc',
      [notation.artistName]
    )
    .limit(limit)
    .toString();
};
