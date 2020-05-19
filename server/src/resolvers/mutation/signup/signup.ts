import { SignupInput, SignupPayload } from '../../../common/types';
import { getEncryptedPassword } from '../../../util/password';
import { toCanonicalUser, transaction } from '../../../data/db';
import {
  setUserSessionTokenCookie,
  getExpiresAt,
} from '../../../util/user-session';
import { ReqCtx } from '../../../util/ctx';
import uuid from 'uuid';
import { sendConfirmationMail } from '../../../jobs/mail';

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
