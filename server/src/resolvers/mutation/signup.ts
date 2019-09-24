import { FieldResolver } from '..';
import {
  SignupInputTypeDef,
  UserTypeDef,
  SignupPayloadTypeDef,
} from '../schema';
import { UserInputError } from 'apollo-server';
import { ValidationError } from 'sequelize';
import getEncryptedPassword from '../../util/getEncryptedPassword';
import getJwt from '../../util/getJwt';
import UserModel from '../../models/UserModel';

const PASSWORD_MIN_LEN = 6;
const PASSWORD_MAX_LEN = 256;

interface Args {
  input: SignupInputTypeDef;
}

const signup: FieldResolver<SignupPayloadTypeDef, undefined, Args> = async (
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
      const user: UserTypeDef = {
        id: userRecord.id,
        username: userRecord.username,
        email: userRecord.email,
        createdAt: userRecord.createdAt,
        updatedAt: userRecord.updatedAt,
      };
      const jwt = getJwt(userRecord.id, ctx.requestedAt);
      transaction.commit();
      return { user, jwt };
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new UserInputError(e.message);
    }
    throw e;
  }
};

export default signup;
