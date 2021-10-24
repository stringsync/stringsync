import { QueryBuilder } from 'knex';
import { times } from 'lodash';
import { Notation } from '../../domain';
import { sql } from './sql';

const applyOrderBys = (b: QueryBuilder, artistName: string, tagIds: string[]) => {
  const bindings = [];
  const orderBys = [];

  if (tagIds.length > 0) {
    // tagBinds will always just be question marks, we don't have to worry about SQL
    // injection errors.
    const tagBinds = times(tagIds.length, () => '?').join(',');
    orderBys.push(`sum(case when notation_tags.tag_id in (${tagBinds}) then 1 else 0 end)`);
    for (const tagId in tagIds) {
      bindings.push(tagId);
    }
  }

  orderBys.push(`case when notations.artist_name = ? then 1 else 0 end`);
  bindings.push(artistName);

  orderBys.push('random()');

  b.orderByRaw(`(${orderBys.join(', ')}) desc`, bindings);
};

export const findSuggestedNotationsQuery = (notation: Notation, tagIds: string[], limit: number): string => {
  const b = sql
    .select('notations.*')
    .from('notations')
    .leftJoin('notation_tags', 'notation_tags.notation_id', 'notations.id')
    .where('notations.id', '!=', notation.id)
    .where('notations.private', '=', false)
    .groupBy('notations.id')
    .limit(limit);

  applyOrderBys(b, notation.artistName, tagIds);

  return b.toString();
};
