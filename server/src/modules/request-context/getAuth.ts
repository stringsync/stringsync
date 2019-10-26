import { Db } from '../../db/types';
import { User } from 'common/types';
import { Auth } from './types';

const getUser = async (
  token: string,
  requestedAt: Date,
  db: Db
): Promise<User | null> => {
  if (!token) {
    return null;
  }
  const userSessionModel = await db.models.UserSession.findOne({
    where: { token },
    include: [{ model: db.models.User }],
  });
  if (!userSessionModel) {
    return null;
  }
  if (userSessionModel.expiresAt < requestedAt) {
    return null;
  }
  return userSessionModel.get('user', { plain: true }) as User;
};

export const getAuth = async (
  token: string,
  requestedAt: Date,
  db: Db
): Promise<Auth> => {
  const user = await getUser(token, requestedAt, db);
  const isLoggedIn = Boolean(user);
  return { isLoggedIn, user, token };
};
