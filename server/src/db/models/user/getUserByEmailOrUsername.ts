import { or } from 'sequelize';
import { Db } from '../../types';
import { RawUser } from './types';

export const getUserByEmailOrUsername = async (
  db: Db,
  emailOrUsername: string
): Promise<RawUser | null> => {
  const email = emailOrUsername;
  const username = emailOrUsername;

  return await db.models.User.findOne({
    raw: true,
    where: {
      ...or({ email }, { username }),
    },
  });
};
