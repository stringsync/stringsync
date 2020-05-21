import {
  ResendConfirmationEmailInput,
  ResendConfirmationEmailOutput,
} from '../../common';
import { sendConfirmationMail } from '../../jobs/mail';
import { transaction } from '../../data/db';
import uuid from 'uuid';
import { ResolverCtx } from '../../util/ctx';
import { IFieldResolver } from 'graphql-tools';

type Resolver = IFieldResolver<
  undefined,
  ResolverCtx,
  { input: ResendConfirmationEmailInput }
>;

export const resendConfirmationEmail: Resolver = async (
  src,
  args,
  ctx
): Promise<ResendConfirmationEmailOutput> => {
  const { email } = args.input;

  return transaction(ctx.db, async () => {
    const user = await ctx.db.models.User.findOne({
      where: { email },
    });

    if (user.id !== ctx.req.session.user.id) {
      throw new Error(`must be logged in as ${email}`);
    }

    if (userModel.confirmedAt) {
      // don't allow users to tell if an email is confirmed or not,
      // fail silently
      return { email };
    }

    const confirmationToken = uuid.v4();
    userModel.update({ confirmationToken });
    await sendConfirmationMail(email, confirmationToken, ctx);

    return { email };
  });
};
