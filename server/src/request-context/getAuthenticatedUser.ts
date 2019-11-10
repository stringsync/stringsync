import { DbAccessor } from '../db';
import { User } from 'common/types';

interface Args {
  token: string;
  requestedAt: Date;
}

export const getAuthenticatedUser: DbAccessor<User | null, Args> = async (
  db,
  transaction,
  args
) => {
  if (!args.token) {
    return null;
  }
  const userSessionModel = await db.models.UserSession.findOne({
    where: { token: args.token },
    include: [{ model: db.models.User }],
    transaction,
  });
  if (!userSessionModel) {
    return null;
  }
  if (userSessionModel.expiresAt < args.requestedAt) {
    return null;
  }
  return userSessionModel.get('User') as User;
};
