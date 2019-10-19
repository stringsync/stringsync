import { FieldResolver } from '..';
import { ForbiddenError } from 'apollo-server';
import { LoginInputType, LoginPayloadType } from '../types';
import { or } from 'sequelize';
import bcrypt from 'bcrypt';
import { RawUser } from '../../db/models/UserModel';
import {
  createUserSession,
  setUserSessionTokenCookie,
} from '../../modules/user-session/';

interface Args {
  input: LoginInputType;
}

export const WRONG_CREDENTIALS_MSG = 'wrong username, email, or password';

export const login: FieldResolver<LoginPayloadType, undefined, Args> = async (
  parent,
  args,
  ctx
) => {
  const email = args.input.emailOrUsername;
  const username = args.input.emailOrUsername;
  const user = (await ctx.db.models.User.findOne({
    raw: true,
    where: {
      ...or({ email }, { username }),
    },
  })) as RawUser | null;

  if (!user) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  const isPassword = await bcrypt.compare(
    args.input.password,
    user.encryptedPassword
  );
  if (!isPassword) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  const userSession = await createUserSession(user.id, ctx);
  setUserSessionTokenCookie(userSession, ctx);

  return { user };
};
