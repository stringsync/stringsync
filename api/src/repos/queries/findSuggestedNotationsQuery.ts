import { sql } from './sql';

export const findSuggestedNotationsQuery = (tagIds: string[], limit: number): string => {
  return sql
    .select('notations.*')
    .from('notations')
    .join('taggings', 'taggings.notation_id', 'notations.id')
    .where('notations.private', '=', false)
    .whereIn('taggings.tag_id', tagIds)
    .groupBy('notations.id')
    .orderByRaw('(count(distinct(taggings.tag_id)), random()) desc')
    .limit(limit)
    .toString();
};
