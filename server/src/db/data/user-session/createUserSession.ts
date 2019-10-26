import { DataAccessor } from '../types';
import { UserSessionModel } from '../../models';
import { USER_SESSION_TOKEN_MAX_AGE_MS } from './constants';

interface Args {
  userId: string;
  issuedAt: Date;
}

export const createUserSession: DataAccessor<UserSessionModel, Args> = async (
  db,
  args
) => {
  const expiresAtMsFromEpoch =
    args.issuedAt.getTime() + USER_SESSION_TOKEN_MAX_AGE_MS;
  const expiresAt = new Date(expiresAtMsFromEpoch);

  return db.models.UserSession.create({
    issuedAt: args.issuedAt,
    userId: args.userId,
    expiresAt,
  });
};
