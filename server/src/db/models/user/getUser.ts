import { Db } from '../../types';
import { toUserPojo } from './toUserPojo';

export const getUser = async (db: Db, id: string) => {
  if (!id) {
    return null;
  }

  const user = await db.models.User.findOne({ where: { id } });
  if (!user) {
    return null;
  }

  return toUserPojo(user);
};
