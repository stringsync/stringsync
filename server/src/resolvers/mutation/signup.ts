import { FieldResolver } from '..';
import { SignupInputType, SignupPayloadType } from '../types';
import { UserInputError } from 'apollo-server';
import { ValidationError } from 'sequelize';
import { getEncryptedPassword } from '../../util/getEncryptedPassword';
import {
  getExpiresAtDetails,
  setUserSessionToken,
} from '../../modules/user-session-token';
import { RawUser } from '../../db/models/UserModel';

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
      const user = userModel.get({ plain: true }) as RawUser;
      const { expiresAt, maxAgeMs } = getExpiresAtDetails(ctx.requestedAt);
      const userSession = await ctx.db.models.UserSession.create({
        userId: user.id,
        expiresAt,
      });
      setUserSessionToken(userSession, maxAgeMs, ctx.res);
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
