import { DataAccessor } from '../types';
import { UserModel } from '../../models/defineUserModel';
import { or } from 'sequelize';

interface Args {
  emailOrUsername: string;
}

export const getUserByEmailOrUsername: DataAccessor<UserModel, Args> = (
  db,
  args
) => {
  const email = args.emailOrUsername;
  const username = args.emailOrUsername;
  return db.models.User.findOne({
    where: {
      ...or({ email }, { username }),
    },
  });
};
