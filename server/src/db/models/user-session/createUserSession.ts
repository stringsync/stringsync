import { Db } from '../../types';
import { USER_SESSION_TOKEN_MAX_AGE_MS } from '../../../user-session/constants';

export const createUserSession = (db: Db, userId: string, issuedAt: Date) => {
  const expiresAt = new Date(
    issuedAt.getTime() + USER_SESSION_TOKEN_MAX_AGE_MS
  );
  return db.models.UserSession.create({
    issuedAt,
    userId: userId,
    expiresAt,
  });
};
