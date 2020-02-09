import { ForbiddenError } from 'apollo-server';
import { LoginInput } from 'common/types';
import { setUserSessionTokenCookie, getExpiresAt } from '../../../user-session';
import { isPassword } from '../../../password';
import { toCanonicalUser } from '../../../db';
import { ReqCtx } from '../../../ctx';
import { or } from 'sequelize';

interface Args {
  input: LoginInput;
}

export const WRONG_CREDENTIALS_MSG = 'wrong username, email, or password';

export const loginResolver = async (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
) => {
  const userModel = await ctx.db.models.User.findOne({
    where: {
      ...or(
        { username: args.input.emailOrUsername },
        { email: args.input.emailOrUsername }
      ),
    },
  });

  if (!userModel) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  if (!(await isPassword(args.input.password, userModel.encryptedPassword))) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  const userSessionModel = await ctx.db.models.UserSession.create({
    issuedAt: ctx.requestedAt,
    userId: userModel.id,
    expiresAt: getExpiresAt(ctx.requestedAt),
  });

  setUserSessionTokenCookie(userSessionModel, ctx.res);

  return { user: toCanonicalUser(userModel) };
};
