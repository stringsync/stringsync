import { createAuthJwt } from '../../util/auth-jwt/createAuthJwt';
import { FieldResolver } from '..';
import { ForbiddenError } from 'apollo-server';
import { LoginInputType, LoginPayloadType } from '../types';
import { or } from 'sequelize';
import { setAuthJwtCookie } from '../../util/auth-jwt/setAuthJwtCookie';
import { toUserPojo } from '../../db/casters/user/toUserPojo';
import bcrypt from 'bcrypt';
import { Db } from '../../db/createDb';

interface Args {
  input: LoginInputType;
}

export const WRONG_CREDENTIALS_MSG = 'wrong username, email, or password';

export const getUserModel = (emailOrUsername: string, db: Db) => {
  const email = emailOrUsername;
  const username = emailOrUsername;
  return db.models.User.findOne({
    where: {
      ...or({ email }, { username }),
    },
  });
};

export const login: FieldResolver<LoginPayloadType, undefined, Args> = async (
  parent,
  args,
  ctx
) => {
  const { emailOrUsername, password } = args.input;

  const userModel = await getUserModel(emailOrUsername, ctx.db);
  if (!userModel) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  const isPassword = await bcrypt.compare(
    password,
    userModel.encryptedPassword
  );
  if (!isPassword) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  const user = toUserPojo(userModel);
  const jwt = createAuthJwt(userModel.id, ctx.requestedAt);
  setAuthJwtCookie(jwt, ctx.res);

  return { user };
};
