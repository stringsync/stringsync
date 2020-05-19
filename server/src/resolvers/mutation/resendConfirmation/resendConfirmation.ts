import {
  ResendConfirmationInput,
  ResendConfirmationPayload,
} from '../../../common';
import { sendConfirmationMail } from '../../../jobs/mail';
import { transaction } from '../../../data/db';
import { Resolver } from '../../types';
import uuid from 'uuid';

interface Args {
  input: ResendConfirmationInput;
}

type ResendConfirmation = Resolver<
  Promise<ResendConfirmationPayload>,
  undefined,
  Args
>;

export const resendConfirmation: ResendConfirmation = async (
  parent,
  args,
  ctx
) => {
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
