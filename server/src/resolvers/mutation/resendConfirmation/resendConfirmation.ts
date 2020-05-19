import { ReqCtx } from '../../../ctx';
import {
  ResendConfirmationInput,
  ResendConfirmationPayload,
} from '../../../common';
import { sendConfirmationMail } from '../../../mail';
import { transaction } from '../../../db';
import uuid = require('uuid');

interface Args {
  input: ResendConfirmationInput;
}

export const resendConfirmation = async (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
): Promise<ResendConfirmationPayload> => {
  const { email } = args.input;

  return transaction(ctx.db, async () => {
    const userModel = await ctx.db.models.User.findOne({
      where: {
        email,
      },
    });

    if (!userModel) {
      throw new Error('invalid email');
    }

    if (userModel.id !== ctx.auth.user!.id) {
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
