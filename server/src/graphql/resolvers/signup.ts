import { SignupInput, SignupOutput } from '../../common';
import { getEncryptedPassword } from '../../util/password';
import { toCanonicalUser, transaction } from '../../data/db';
import { sendConfirmationMail } from '../../jobs/mail';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../util/ctx';
import { toSessionUser } from '../../util/session';
import uuid from 'uuid';

type Resolver = IFieldResolver<undefined, ResolverCtx, { input: SignupInput }>;

export const signup: Resolver = async (
  src,
  args,
  ctx
): Promise<SignupOutput> => {
  const { username, email, password } = args.input;
  const encryptedPassword = await getEncryptedPassword(password);
  const confirmationToken = uuid.v4();

  return transaction(ctx.db, async () => {
    const user = await ctx.db.models.User.create({
      username,
      email,
      encryptedPassword,
      confirmationToken,
    });

    ctx.req.session.user = toSessionUser(user);

    await sendConfirmationMail(email, confirmationToken, ctx);

    return { user: toCanonicalUser(user) };
  });
};
