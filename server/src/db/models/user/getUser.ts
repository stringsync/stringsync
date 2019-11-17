import { Db } from '../../types';

export const getUser = async (db: Db, id: string) => {
  if (!id) {
    return null;
  }
  return await db.models.User.findOne({ raw: true, where: { id } });
};
