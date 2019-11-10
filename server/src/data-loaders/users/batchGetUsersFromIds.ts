import { alignOneToOne, MissingValueError } from '../../align';
import { Db } from '../../db';
import { User } from 'common/types';

export const batchGetUsersFromIds = (db: Db) => async (
  ids: string[]
): Promise<Array<User | MissingValueError>> => {
  const users = (await db.models.User.findAll({
    raw: true,
    where: { id: ids },
  })) as User[];
  return alignOneToOne(ids, users, {
    getKey: (user) => user.id,
    getUniqueIdentifier: (user) => user.id,
    getMissingValue: (key) => new MissingValueError(key),
  });
};
