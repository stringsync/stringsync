import { DbAccessor, UserSessionModel } from '../db';
import { USER_SESSION_TOKEN_MAX_AGE_MS } from './constants';

interface Args {
  userId: string;
  issuedAt: Date;
}

export const createUserSession: DbAccessor<UserSessionModel, Args> = (
  db,
  transaction,
  args
) => {
  const expiresAt = new Date(
    args.issuedAt.getTime() + USER_SESSION_TOKEN_MAX_AGE_MS
  );
  return db.models.UserSession.create(
    {
      issuedAt: args.issuedAt,
      userId: args.userId,
      expiresAt,
    },
    { transaction }
  );
};
