import { DbAccessor } from '../../db';
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
  // TODO(jared)
  // When transaction is undefined (i.e. in prod),
  // this method behaves as expected.
  // When transaction is defined (i.e. in test), then
  // getUser() returns null.
  // Follow up on these open github issues and try to use the
  // belongs to association getter
  // https://github.com/sequelize/sequelize/issues/11459
  // https://github.com/sequelize/sequelize/issues/11459
  return userSessionModel.get('User') as User;
};
