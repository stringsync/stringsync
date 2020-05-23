import {
  SignupInput,
  SignupOutput,
  compose,
  AuthRequirements,
} from '../../../../common';
import { makeEncryptedPassword } from '../../../../util/password';
import { toUser } from '../../../../data/db';
import { sendConfirmationMail } from '../../../../jobs/mail';
import { ResolverCtx } from '../../../../util/ctx';
import { toSessionUser } from '../../../../util/session';
import uuid from 'uuid';
import { withAuthRequirement, withTransaction } from '../../../middlewares';
import { Resolver } from '../../../types';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_OUT),
  withTransaction
);

export const resolver: Resolver<
  Promise<SignupOutput>,
  undefined,
  SignupInput,
  ResolverCtx
> = async (src, args, ctx) => {
  const { username, email, password } = args.input;
  const encryptedPassword = await makeEncryptedPassword(password);
  const confirmationToken = uuid.v4();
  const user = await ctx.db.User.create({
    username,
    email,
    encryptedPassword,
    confirmationToken,
  });

  ctx.req.session.user = toSessionUser(user);

  await sendConfirmationMail(email, confirmationToken, ctx);

  return { user: toUser(user) };
};

export const signup = middleware(resolver);
