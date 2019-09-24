import { FieldResolver } from '..';
import { ForbiddenError } from 'apollo-server';
import { getJwt } from '../../util/getJwt';
import { getUserType } from '../../util/getUserType';
import { LoginInputTypeDef, LoginPayloadTypeDef } from '../schema';
import { or } from 'sequelize';
import { UserModel } from '../../models/UserModel';
import bcrypt from 'bcrypt';

interface Args {
  input: LoginInputTypeDef;
}

export const WRONG_CREDENTIALS_MSG = 'wrong username, email, or password';

export const getUserRecord = (emailOrUsername: string, password: string) => {
  const email = emailOrUsername;
  const username = emailOrUsername;
  return UserModel.findOne({
    where: {
      ...or({ email }, { username }),
    },
  });
};

export const login: FieldResolver<
  LoginPayloadTypeDef,
  undefined,
  Args
> = async (parent, args, ctx) => {
  const { emailOrUsername, password } = args.input;

  const userRecord = await getUserRecord(emailOrUsername, password);
  if (!userRecord) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  const isPassword = await bcrypt.compare(
    password,
    userRecord.encryptedPassword
  );
  if (!isPassword) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  const user = getUserType(userRecord);
  const jwt = getJwt(userRecord.id, ctx.requestedAt);
  return { user, jwt };
};
