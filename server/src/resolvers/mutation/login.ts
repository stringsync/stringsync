import { ForbiddenError } from 'apollo-server';
import UserModel from '../../models/UserModel';
import { UserTypeDef, LoginInputTypeDef, LoginPayloadTypeDef } from '../schema';
import getJwt from '../../util/getJwt';
import bcrypt from 'bcrypt';
import { or } from 'sequelize';
import { FieldResolver } from '..';

interface Args {
  input: LoginInputTypeDef;
}

const login: FieldResolver<LoginPayloadTypeDef, undefined, Args> = async (
  parent,
  args,
  ctx
) => {
  const password = args.input.password;
  const email = args.input.emailOrUsername;
  const username = args.input.emailOrUsername;

  // fetch record
  const userRecord = await UserModel.findOne({
    where: {
      ...or({ email }, { username }),
    },
  });
  if (!userRecord) {
    throw new ForbiddenError('wrong username, email, or password');
  }

  // check password
  const isPassword = await bcrypt.compare(
    password,
    userRecord.encryptedPassword
  );
  if (!isPassword) {
    throw new ForbiddenError('wrong username, email, or password');
  }

  // return user
  const user: UserTypeDef = {
    id: userRecord.id,
    username: userRecord.username,
    createdAt: userRecord.createdAt,
    updatedAt: userRecord.updatedAt,
    email: userRecord.email,
  };
  return {
    user,
    jwt: getJwt(userRecord.id, ctx.requestedAt),
  };
};

export default login;
