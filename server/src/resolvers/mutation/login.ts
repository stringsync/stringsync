import { createAuthJwt } from '../../util/auth-jwt/createAuthJwt';
import { FieldResolver } from '..';
import { ForbiddenError } from 'apollo-server';
import { LoginInputType, LoginPayloadType } from '../types';
import { or } from 'sequelize';
import { setAuthJwtCookie } from '../..//util/auth-jwt/setAuthJwtCookie';
import { toUserPojo } from '../../casters/user/toUserPojo';
import { UserModel } from '../../models/UserModel';
import bcrypt from 'bcrypt';

interface Args {
  input: LoginInputType;
}

export const WRONG_CREDENTIALS_MSG = 'wrong username, email, or password';

export const getUserModel = (emailOrUsername: string) => {
  const email = emailOrUsername;
  const username = emailOrUsername;
  return UserModel.findOne({
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

  const userModel = await getUserModel(emailOrUsername);
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
