import {
  SignupInput,
  SignupOutput,
  compose,
  AuthRequirements,
} from '../../../../common';
import { makeEncryptedPassword } from '../../../../util/password';
import { toCanonicalUser, transaction } from '../../../../data/db';
import { sendConfirmationMail } from '../../../../jobs/mail';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../../../util/ctx';
import { toSessionUser } from '../../../../util/session';
import uuid from 'uuid';
import { withAuthRequirement, withTransaction } from '../../../middlewares';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_OUT),
  withTransaction
);

export const resolver: IFieldResolver<
  undefined,
  ResolverCtx,
  SignupInput
> = async (src, args, ctx): Promise<SignupOutput> => {
  const { username, email, password } = args.input;
  const encryptedPassword = await makeEncryptedPassword(password);
  const confirmationToken = uuid.v4();
  const user = await ctx.db.models.User.create({
    username,
    email,
    encryptedPassword,
    confirmationToken,
  });

  ctx.req.session.user = toSessionUser(user);

  await sendConfirmationMail(email, confirmationToken, ctx);

  return { user: toCanonicalUser(user) };
};

export const signup = middleware(resolver);
