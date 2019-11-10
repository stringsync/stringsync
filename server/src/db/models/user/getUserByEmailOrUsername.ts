import { or } from 'sequelize';
import { Db } from '../../types';
import { RawUser } from './types';

export const getUserByEmailOrUsername = async (
  db: Db,
  emailOrUsername: string
) => {
  const email = emailOrUsername;
  const username = emailOrUsername;

  const rawUser: RawUser | null = await db.models.User.findOne({
    raw: true,
    where: {
      ...or({ email }, { username }),
    },
  });

  return rawUser;
};
