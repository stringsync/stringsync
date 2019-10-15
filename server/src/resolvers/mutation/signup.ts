import { FieldResolver } from '..';
import { SignupInputType, SignupPayloadType } from '../types';
import { UserInputError } from 'apollo-server';
import { ValidationError } from 'sequelize';
import { getEncryptedPassword } from '../../util/getEncryptedPassword';
import { createAuthJwt } from '../../util/auth-jwt/createAuthJwt';
import { toUserPojo } from '../../db/casters/user/toUserPojo';
import { setAuthJwtCookie } from '../../util/auth-jwt/setAuthJwtCookie';

const PASSWORD_MIN_LEN = 6;
const PASSWORD_MAX_LEN = 256;

interface Args {
  input: SignupInputType;
}

export const validatePassword = (password: string) => {
  if (password.length < PASSWORD_MIN_LEN) {
    throw new UserInputError(
      `password must have at least ${PASSWORD_MIN_LEN} characters`
    );
  }
  if (password.length > PASSWORD_MAX_LEN) {
    throw new UserInputError(
      `password must have no more than ${PASSWORD_MAX_LEN} characters`
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
    return ctx.db.connection.transaction(async (transaction) => {
      const encryptedPassword = await getEncryptedPassword(password);
      const userModel = await ctx.db.models.User.create(
        { username, email, encryptedPassword },
        { transaction }
      );
      const user = toUserPojo(userModel);
      const jwt = createAuthJwt(user.id, ctx.requestedAt);
      setAuthJwtCookie(jwt, ctx.res);
      return { user };
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new UserInputError(err.message);
    }
    throw err;
  }
};

export default signup;
