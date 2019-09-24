import { FieldResolver } from '..';
import { SignupInputTypeDef, SignupPayloadTypeDef } from '../schema';
import { UserInputError } from 'apollo-server';
import { UserModel } from '../../models/UserModel';
import { ValidationError, Transaction } from 'sequelize';
import { getEncryptedPassword } from '../../util/getEncryptedPassword';
import { getJwt } from '../../util/getJwt';
import { getUserTypeDef } from '../../util/getUserTypeDef';

const PASSWORD_MIN_LEN = 6;
const PASSWORD_MAX_LEN = 256;

interface Args {
  input: SignupInputTypeDef;
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

export const createUser = async (
  username: string,
  email: string,
  password: string,
  transaction: Transaction
) => {
  const encryptedPassword = await getEncryptedPassword(password);
  return UserModel.create(
    {
      username,
      email,
      encryptedPassword,
    },
    { transaction }
  );
};

export const signup: FieldResolver<
  SignupPayloadTypeDef,
  undefined,
  Args
> = async (parent, args, ctx) => {
  const { username, email, password } = args.input;

  validatePassword(password);

  try {
    return ctx.db.transaction(async (transaction) => {
      const userRecord = await createUser(
        username,
        email,
        password,
        transaction
      );

      const user = getUserTypeDef(userRecord);
      const jwt = getJwt(userRecord.id, ctx.requestedAt);

      transaction.commit();

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
