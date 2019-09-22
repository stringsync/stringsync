import { IFieldResolver, UserInputError } from 'apollo-server';
import { UserInput } from '../type-defs/User';
import { Context } from '../../util/getContext';
import User from '../../models/User';
import { ValidationError } from 'sequelize';
import bcrypt from 'bcrypt';

const PASSWORD_MIN_LEN = 6;
const PASSWORD_MAX_LEN = 256;
const HASH_ROUNDS = 10; // yum

interface Args {
  input: UserInput;
}

const signup: IFieldResolver<any, Context, Args> = async (parent, args) => {
  const { username, email, password } = args.input;

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

  const encryptedPassword = await bcrypt.hash(password, HASH_ROUNDS);

  try {
    return User.create({ username, email, encryptedPassword });
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new UserInputError(e.message);
    }
    throw e;
  }
};

export default signup;
