import { Db } from '../../types';
import { USER_SESSION_TOKEN_MAX_AGE_MS } from '../../../user-session/constants';
import { RawUserSession } from './types';

export const createRawUserSession = async (
  db: Db,
  userId: string,
  issuedAt: Date
): Promise<RawUserSession> => {
  const expiresAt = new Date(
    issuedAt.getTime() + USER_SESSION_TOKEN_MAX_AGE_MS
  );
  return await db.models.UserSession.create(
    {
      issuedAt,
      userId: userId,
      expiresAt,
    },
    { raw: true }
  );
};
