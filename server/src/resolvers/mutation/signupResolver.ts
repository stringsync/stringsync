import { SignupInput, SignupPayload } from 'common/types';
import { UserInputError } from 'apollo-server';
import { ValidationError } from 'sequelize';
import { getEncryptedPassword } from '../../encrypted-password';
import { createRawUserSession, toCanonicalUser, transaction } from '../../db';
import { setUserSessionTokenCookie } from '../../user-session';
import { RequestContext } from '../../request-context';

const PASSWORD_MIN_LEN = 6;
const PASSWORD_MAX_LEN = 256;

interface Args {
  input: SignupInput;
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

export const signupResolver = async (
  parent: undefined,
  args: Args,
  ctx: RequestContext
): Promise<SignupPayload> => {
  const { username, email, password } = args.input;

  validatePassword(password);

  try {
    return transaction(ctx.db, async () => {
      const encryptedPassword = await getEncryptedPassword(password);
      const userModel = await ctx.db.models.User.create({
        username,
        email,
        encryptedPassword,
      });
      const userSessionModel = await createRawUserSession(
        ctx.db,
        userModel.id,
        ctx.requestedAt
      );
      setUserSessionTokenCookie(userSessionModel, ctx.res);
      return { user: toCanonicalUser(userModel) };
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new UserInputError(err.message);
    }
    throw err;
  }
};
