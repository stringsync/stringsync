import {
  ResendConfirmationEmailInput,
  ResendConfirmationEmailOutput,
} from '../../common';
import { sendConfirmationMail } from '../../jobs/mail';
import { transaction } from '../../data/db';
import uuid from 'uuid';
import { ResolverCtx } from '../../util/ctx';
import { IFieldResolver } from 'graphql-tools';
import { NotFoundError, BadRequestError } from '../../common/errors';

type Resolver = IFieldResolver<
  undefined,
  ResolverCtx,
  { input: ResendConfirmationEmailInput }
>;

export const resendConfirmationEmail: Resolver = async (
  src,
  args,
  ctx
): Promise<ResendConfirmationEmailOutput> =>
  transaction(ctx.db, async () => {
    const { email } = args.input;
    const user = await ctx.db.models.User.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError(`user not found: ${email}`);
    }
    if (user.id !== ctx.req.session.user.id) {
      throw new Error(`must be logged in as ${email}`);
    }
    if (user.confirmedAt) {
      throw new BadRequestError('email already confirmed');
    }

    const confirmationToken = uuid.v4();
    user.update({ confirmationToken });
    await sendConfirmationMail(email, confirmationToken, ctx);

    return { email };
  });
