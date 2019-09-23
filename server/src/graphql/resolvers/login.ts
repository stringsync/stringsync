import { IFieldResolver, ForbiddenError } from 'apollo-server';
import { Context } from '../../util/getContext';
import UserModel from '../../models/User';
import { User, LoginInput } from '../type-defs/User';
import getJwt from '../../util/getJwt';
import bcrypt from 'bcrypt';
import { or } from 'sequelize';

interface Args {
  input: LoginInput;
}

const login: IFieldResolver<any, Context, Args> = async (parent, args, ctx) => {
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
  const user: User = {
    id: userRecord.id,
    username: userRecord.username,
    createdAt: userRecord.createdAt,
    email: userRecord.email,
    jwt: getJwt(userRecord.id, ctx.requestedAt),
  };
  return user;
};

export default login;
