import { FieldResolver } from '..';
import { ForbiddenError } from 'apollo-server';
import { LoginInput, LoginPayload } from 'common/types';
import {
  setUserSessionTokenCookie,
  getExpiresAt,
} from '../../modules/user-session/';
import { isPassword } from '../../modules/encrypted-password';
import { or } from 'sequelize';

interface Args {
  input: LoginInput;
}

export const WRONG_CREDENTIALS_MSG = 'wrong username, email, or password';

export const login: FieldResolver<LoginPayload, undefined, Args> = async (
  parent,
  args,
  ctx
) => {
  const emailOrUsername = args.input.emailOrUsername;
  const userModel = await ctx.db.models.User.findOne({
    where: {
      ...or({ email: emailOrUsername }, { username: emailOrUsername }),
    },
  });
  if (!userModel) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  if (!(await isPassword(args.input.password, userModel.encryptedPassword))) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  const userSessionModel = await ctx.db.models.UserSession.create({
    userId: userModel.id,
    issuedAt: ctx.requestedAt,
    expiresAt: getExpiresAt(ctx.requestedAt),
  });
  setUserSessionTokenCookie(userSessionModel, ctx.res);

  return { user: userModel };
};
