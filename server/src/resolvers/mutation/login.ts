import { FieldResolver } from '..';
import { ForbiddenError } from 'apollo-server';
import { LoginInput, LoginPayload } from 'common/types';
import bcrypt from 'bcrypt';
import {
  createUserSession,
  setUserSessionTokenCookie,
} from '../../modules/user-session/';

interface Args {
  input: LoginInput;
}

export const WRONG_CREDENTIALS_MSG = 'wrong username, email, or password';

export const login: FieldResolver<LoginPayload, undefined, Args> = async (
  parent,
  args,
  ctx
) => {
  const userModel = await ctx.data.User.getUserByEmailOrUsername(ctx.db, {
    emailOrUsername: args.input.emailOrUsername,
  });
  if (!userModel) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  const isPassword = await bcrypt.compare(
    args.input.password,
    userModel.encryptedPassword
  );
  if (!isPassword) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  const userSessionModel = await ctx.data.UserSession.createUserSession(
    ctx.db,
    {
      userId: userModel.id,
      issuedAt: ctx.requestedAt,
    }
  );
  setUserSessionTokenCookie(userSessionModel, ctx);

  return { user: userModel };
};
