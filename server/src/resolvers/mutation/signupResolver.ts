import { ValidationError } from 'sequelize';
import { SignupInput, SignupPayload } from 'common/types';
import { UserInputError } from 'apollo-server';
import { getEncryptedPassword } from '../../password';
import { createRawUserSession, toCanonicalUser, transaction } from '../../db';
import { setUserSessionTokenCookie } from '../../user-session';
import { RequestContext } from '../../request-context';

interface Args {
  input: SignupInput;
}

export const signupResolver = async (
  parent: undefined,
  args: Args,
  ctx: RequestContext
): Promise<SignupPayload> => {
  const { username, email, password } = args.input;
  const encryptedPassword = await getEncryptedPassword(password);
  return transaction(ctx.db, async () => {
    try {
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
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new UserInputError(err.message);
      }
      throw err;
    }
  });
};
