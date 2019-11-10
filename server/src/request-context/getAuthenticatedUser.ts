import { Db, RawUser } from '../db';

export const getAuthenticatedUser = async (
  db: Db,
  token: string,
  requestedAt: Date
) => {
  if (!token) {
    return null;
  }
  const userSessionModel = await db.models.UserSession.findOne({
    where: { token: token },
    include: [{ model: db.models.User }],
  });
  if (!userSessionModel) {
    return null;
  }
  if (userSessionModel.expiresAt < requestedAt) {
    return null;
  }
  return userSessionModel.get('User', { plain: true }) as RawUser;
};
