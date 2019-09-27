import { FieldResolver } from '..';
import { SignupInputType, SignupPayloadType } from '../types';
import { UserInputError } from 'apollo-server';
import { UserModel } from '../../models/UserModel';
import { ValidationError, Transaction } from 'sequelize';
import { getEncryptedPassword } from '../../util/getEncryptedPassword';
import { createJwt } from '../../util/createJwt';
import { getUserType } from '../../util/getUserType';

const PASSWORD_MIN_LEN = 6;
const PASSWORD_MAX_LEN = 256;

interface Args {
  input: SignupInputType;
}

export const validatePassword = (password: string) => {
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
};

export const signup: FieldResolver<SignupPayloadType, undefined, Args> = async (
  parent,
  args,
  ctx
) => {
  const { username, email, password } = args.input;

  validatePassword(password);

  try {
    return ctx.db.transaction(async (transaction) => {
      const encryptedPassword = await getEncryptedPassword(password);
      const userRecord = await UserModel.create(
        { username, email, encryptedPassword },
        { transaction }
      );
      const user = getUserType(userRecord);
      const jwt = createJwt(userRecord.id, ctx.requestedAt);
      return { user, jwt };
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new UserInputError(err.message);
    }
    throw err;
  }
};

export default signup;
