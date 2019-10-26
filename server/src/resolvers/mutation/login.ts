import { FieldResolver } from '..';
import { ForbiddenError } from 'apollo-server';
import { LoginInput, LoginPayload } from 'common/types';
import { or } from 'sequelize';
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

  const userSession = await createUserSession(userModel.id, ctx);
  setUserSessionTokenCookie(userSession, ctx);

  return { user: userModel };
};
