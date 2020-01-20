import { alignOneToOne } from '../../align-arrays';
import { Db, toCanonicalUser } from '../../db';
import { User } from 'common/types';

export const batchGetUsersFromIds = (db: Db) => async (
  ids: string[]
): Promise<Array<User | null>> => {
  const users = (
    await db.models.User.findAll({
      raw: true,
      where: { id: ids },
    })
  ).map(toCanonicalUser);

  return alignOneToOne(ids, users, {
    getKey: (user) => user.id,
    getUniqueIdentifier: (user) => user.id,
    getMissingValue: () => null,
  });
};
