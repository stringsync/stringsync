import { RequestContext } from '../request-context';
import { USER_SESSION_TOKEN_MAX_AGE_MS } from './constants';
import { Transaction } from 'sequelize';
import { UserSessionModel } from '../../db';

export const createUserSession = async (
  userId: string,
  ctx: RequestContext,
  transaction?: Transaction
): Promise<UserSessionModel> => {
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

  return userSessionModel;
};
