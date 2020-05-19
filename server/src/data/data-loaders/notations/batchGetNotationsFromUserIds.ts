import { alignOneToMany } from '../align-arrays';
import { Db } from '../../db';
import { Notation } from '../../../common';
import { flatten } from 'lodash';

export const batchGetNotationsFromUserIds = (db: Db) => async (
  userIds: string[]
) => {
  // userId can have many notations
  const notations = userIds.map((userId) => {
    return [{ id: userId }];
  });
  return alignOneToMany(userIds, flatten(notations), {
    getKey: (notation) => notation.id,
    getUniqueIdentifier: (notation) => notation.id,
    getMissingValue: (key): Notation[] => [],
  });
};
