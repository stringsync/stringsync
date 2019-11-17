import { Db } from '../../types';

export const getUsers = async (db: Db) => {
  return await db.models.User.findAll({ raw: true });
};
