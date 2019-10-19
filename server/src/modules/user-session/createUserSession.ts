import { RequestContext } from '../request-context';
import { USER_SESSION_TOKEN_MAX_AGE_MS } from './constants';
import { RawUserSession } from '../../db/models/UserSessionModel';
import { Transaction } from 'sequelize';

export const createUserSession = async (
  userId: string,
  ctx: RequestContext,
  transaction?: Transaction
): Promise<RawUserSession> => {
  const expiresAtMsFromEpoch =
    ctx.requestedAt.getTime() + USER_SESSION_TOKEN_MAX_AGE_MS;
  const expiresAt = new Date(expiresAtMsFromEpoch);

  const userSessionModel = await ctx.db.models.UserSession.create(
    {
      issuedAt: ctx.requestedAt,
      userId,
      expiresAt,
    },
    { transaction }
  );

  return userSessionModel.get() as RawUserSession;
};
