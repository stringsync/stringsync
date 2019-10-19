import { Db } from '../../db/createDb';
import { User } from 'common/types';

export const authenticate = async (
  token: string,
  requestedAt: Date,
  db: Db
): Promise<User | null> => {
  if (!token) {
    return null;
  }
  const session = await db.models.UserSession.findOne({
    where: { token },
    include: [{ model: db.models.User }],
  });
  if (!session) {
    return null;
  }
  if (session.expiresAt < requestedAt) {
    return null;
  }
  return session.get('user', { plain: true }) as User | null;
};
