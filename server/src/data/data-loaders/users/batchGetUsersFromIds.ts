import { alignOneToOne } from '../align-arrays';
import { Db, toUser } from '../../db';
import { User } from '../../../common';

export const batchGetUsersFromIds = (db: Db) => async (
  ids: string[]
): Promise<Array<User | null>> => {
  const users = (
    await db.User.findAll({
      raw: true,
      where: { id: ids },
    })
  ).map(toUser);

  return alignOneToOne(ids, users, {
    getKey: (user) => user.id,
    getUniqueIdentifier: (user) => user.id,
    getMissingValue: () => null,
  });
};
