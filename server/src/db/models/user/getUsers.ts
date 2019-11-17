import { toUserPojo } from '../..';
import { Db } from '../../types';

export const getUsers = async (db: Db) => {
  const users = await db.models.User.findAll({ raw: true });
  return users.map(toUserPojo);
};
