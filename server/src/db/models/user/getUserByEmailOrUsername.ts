import { or } from 'sequelize';
import { Db } from '../../types';

export const getUserByEmailOrUsername = async (
  db: Db,
  emailOrUsername: string
) => {
  const email = emailOrUsername;
  const username = emailOrUsername;
  return await db.models.User.findOne({
    where: {
      ...or({ email }, { username }),
    },
  });
};
