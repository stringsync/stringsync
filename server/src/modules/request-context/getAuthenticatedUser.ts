import { DataAccessor, UserModel } from '../../db';

interface Args {
  token: string;
  requestedAt: Date;
}

export const getAuthenticatedUser: DataAccessor<
  UserModel | null,
  Args
> = async (db, args, transaction) => {
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
  return userSessionModel.getUser();
};
