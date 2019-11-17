import { Db } from '../../types';
import { RawUser } from './types';

export const getRawUser = async (
  db: Db,
  id: string
): Promise<RawUser | null> => {
  if (!id) {
    return null;
  }
  return await db.models.User.findOne({
    raw: true,
    where: { id },
  });
};
