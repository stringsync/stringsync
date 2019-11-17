import { Db } from '../../types';
import { RawUser } from './types';

export const getRawUsers = async (db: Db): Promise<RawUser[]> => {
  return await db.models.User.findAll({ raw: true });
};
