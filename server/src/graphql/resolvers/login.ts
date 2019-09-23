import { IFieldResolver, AuthenticationError } from 'apollo-server';
import { Context } from '../../util/getContext';
import UserModel from '../../models/User';
import { User } from '../type-defs/User';
import getJwt from '../../util/getJwt';
import getEncryptedPassword from '../../util/getEncryptedPassword';
import { or } from 'sequelize';

interface Args {
  emailOrUsername: string;
  password: string;
}

const login: IFieldResolver<any, Context, Args> = async (
  parent,
  args,
  context
) => {
  const encryptedPassword = await getEncryptedPassword(args.password);
  let email = args.emailOrUsername;
  let username = args.emailOrUsername;

  // Fetch the user using the encrypted password, which will verify if the
  // password was correct
  const userRecord = await UserModel.findOne({
    where: {
      encryptedPassword,
      ...or({ email }, { username }),
    },
  });

  if (!userRecord) {
    throw new AuthenticationError('wrong username, email, or password');
  }

  const user: User = {
    id: userRecord.id,
    username: userRecord.username,
    createdAt: userRecord.createdAt,
    email: userRecord.email,
    jwt: getJwt(userRecord.id, context.requestedAt),
  };
  return user;
};

export default login;
