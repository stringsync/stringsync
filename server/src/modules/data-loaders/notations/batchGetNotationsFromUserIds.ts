import { alignOneToMany } from '../../align';
import { Db } from '../../../db';
import { Notation } from 'common/types';
import { flatten } from 'lodash';

export const batchGetNotationsFromUserIds = (db: Db) => async (
  userIds: string[]
) => {
  // userId can have many notations
  const notations = userIds.map<Notation[]>((userId) => {
    return [{ id: userId }];
  });
  return alignOneToMany(userIds, flatten(notations), {
    getKey: (notation) => notation.id,
    getUniqueIdentifier: (notation) => notation.id,
  });
};
