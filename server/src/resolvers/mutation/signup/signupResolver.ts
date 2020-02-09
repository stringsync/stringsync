import { SignupInput, SignupPayload } from 'common/types';
import { ForbiddenError, UserInputError } from 'apollo-server';
import { getEncryptedPassword } from '../../../password';
import { toCanonicalUser, transaction } from '../../../db';
import { setUserSessionTokenCookie, getExpiresAt } from '../../../user-session';
import { ReqCtx } from '../../../ctx';

interface Args {
  input: SignupInput;
}

export const signupResolver = async (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
): Promise<SignupPayload> => {
  if (ctx.auth.isLoggedIn) {
    throw new ForbiddenError('already logged in');
  }

  const { username, email, password } = args.input;
  if (password.length < 6) {
    throw new UserInputError('password must be at least 6 characters');
  }
  if (password.length > 256) {
    throw new UserInputError('password must be at most 256 characters');
  }

  const encryptedPassword = await getEncryptedPassword(password);
  return transaction(ctx.db, async () => {
    const userModel = await ctx.db.models.User.create({
      username,
      email,
      encryptedPassword,
    });
    const userSessionModel = await ctx.db.models.UserSession.create({
      issuedAt: ctx.requestedAt,
      userId: userModel.id,
      expiresAt: getExpiresAt(ctx.requestedAt),
    });
    setUserSessionTokenCookie(userSessionModel, ctx.res);
    return { user: toCanonicalUser(userModel) };
  });
};
