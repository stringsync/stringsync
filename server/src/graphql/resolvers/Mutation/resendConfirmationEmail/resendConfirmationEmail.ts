import {
  ResendConfirmationEmailInput,
  ResendConfirmationEmailOutput,
  compose,
  AuthRequirements,
} from '../../../../common';
import { sendConfirmationMail } from '../../../../jobs/mail';
import uuid from 'uuid';
import { ResolverCtx } from '../../../../util/ctx';

import { NotFoundError, BadRequestError } from '../../../../common/errors';
import { withAuthRequirement, withTransaction } from '../../../middlewares';
import { Resolver } from '../../../types';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_IN),
  withTransaction
);

export const resolver: Resolver<
  Promise<ResendConfirmationEmailOutput>,
  undefined,
  ResendConfirmationEmailInput,
  ResolverCtx
> = async (src, args, ctx) => {
  const { email } = args.input;
  const pk = ctx.req.session.user.id;
  const user = await ctx.db.User.findByPk(pk);

  if (!user) {
    throw new NotFoundError(`user not found: ${email}`);
  }
  if (user.email !== email) {
    throw new Error(`must be logged in as ${email}`);
  }
  if (user.confirmedAt) {
    throw new BadRequestError('email already confirmed');
  }

  user.confirmationToken = uuid.v4();
  await user.save();
  await sendConfirmationMail(user.email, user.confirmationToken, ctx);

  return { email };
};

export const resendConfirmationEmail = middleware(resolver);
