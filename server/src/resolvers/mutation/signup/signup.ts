import { SignupInput, SignupPayload } from '../../../common/types';
import { getEncryptedPassword } from '../../../password';
import { toCanonicalUser, transaction } from '../../../db';
import { setUserSessionTokenCookie, getExpiresAt } from '../../../user-session';
import { ReqCtx } from '../../../ctx';
import uuid from 'uuid';
import { sendConfirmationMail } from '../../../mail';

interface Args {
  input: SignupInput;
}

export const signup = async (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
): Promise<SignupPayload> => {
  if (ctx.auth.isLoggedIn) {
    throw new Error('already logged in');
  }

  const { username, email, password } = args.input;
  if (password.length < 6) {
    throw new Error('password must be at least 6 characters');
  }
  if (password.length > 256) {
    throw new Error('password must be at most 256 characters');
  }

  const encryptedPassword = await getEncryptedPassword(password);
  const confirmationToken = uuid.v4();

  return transaction(ctx.db, async () => {
    const userModel = await ctx.db.models.User.create({
      username,
      email,
      encryptedPassword,
      confirmationToken,
    });

    const userSessionModel = await ctx.db.models.UserSession.create({
      issuedAt: ctx.requestedAt,
      userId: userModel.id,
      expiresAt: getExpiresAt(ctx.requestedAt),
    });

    setUserSessionTokenCookie(userSessionModel, ctx.res);

    await sendConfirmationMail(email, confirmationToken, ctx);

    return { user: toCanonicalUser(userModel) };
  });
};
