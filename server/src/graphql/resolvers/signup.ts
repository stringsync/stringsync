import { IFieldResolver, UserInputError } from 'apollo-server';
import { SignupInput } from '../type-defs/User';
import { Context } from '../../util/getContext';
import UserModel from '../../models/User';
import { ValidationError } from 'sequelize';
import getJwt from '../../util/getJwt';
import getEncryptedPassword from '../../util/getEncryptedPassword';

const PASSWORD_MIN_LEN = 6;
const PASSWORD_MAX_LEN = 256;

interface Args {
  input: SignupInput;
}

const signup: IFieldResolver<any, Context, Args> = async (
  parent,
  args,
  ctx
) => {
  const { username, email, password } = args.input;

  // check password
  if (password.length < PASSWORD_MIN_LEN) {
    throw new UserInputError(
      `password must be greater than ${PASSWORD_MIN_LEN} characters`
    );
  }
  if (password.length > PASSWORD_MAX_LEN) {
    throw new UserInputError(
      `password must be less than ${PASSWORD_MAX_LEN} characters`
    );
  }

  // try creating user
  try {
    return ctx.db.transaction(async (transaction) => {
      const userRecord = await UserModel.create(
        {
          username,
          email,
          encryptedPassword: await getEncryptedPassword(password),
        },
        { transaction }
      );
      const user = {
        id: userRecord.id,
        username: userRecord.username,
        email: userRecord.email,
        createdAt: userRecord.createdAt,
        jwt: getJwt(userRecord.id, ctx.requestedAt),
      };
      transaction.commit();
      return user;
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new UserInputError(e.message);
    }
    throw e;
  }
};

export default signup;
