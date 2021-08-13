import { QueryBuilder } from 'knex';
import { times } from 'lodash';
import { Notation } from '../../domain';
import { sql } from './sql';

const applyTagIds = (b: QueryBuilder, tagIds: string[]) => {
  if (tagIds.length === 0) {
    return;
  }
  const bindings = times(tagIds.length, () => '?').join(',');
  b.orderByRaw(`sum(case when taggings.tag_id in (${bindings}) then 1 else 0 end) desc`, tagIds);
};

const applyArtistName = (b: QueryBuilder, artistName: string) => {
  b.orderByRaw(`case when notations.artist_name = ? then 1 else 0 end desc`, artistName);
};

const applyRandomOrder = (b: QueryBuilder) => {
  b.orderByRaw('random()');
};

export const findSuggestedNotationsQuery = (notation: Notation, tagIds: string[], limit: number): string => {
  const b = sql
    .select('notations.*')
    .from('notations')
    .leftJoin('taggings', 'taggings.notation_id', 'notations.id')
    .where('notations.id', '!=', notation.id)
    .where('notations.private', '=', false)
    .groupBy('notations.id')
    .limit(limit);

  applyTagIds(b, tagIds);
  applyArtistName(b, notation.artistName);
  applyRandomOrder(b);

  return b.toString();
};
