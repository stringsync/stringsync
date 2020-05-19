import { ReqCtx } from '../../../util/ctx';
import { ConfirmEmailInput, ConfirmEmailPayload } from '../../../common/types';
import { toCanonicalUser } from '../../../data/db';

interface Args {
  input: ConfirmEmailInput;
}

export const confirmEmail = async (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
): Promise<ConfirmEmailPayload> => {
  const userModel = await ctx.db.models.User.findOne({
    include: [
      {
        model: ctx.db.models.UserSession,
        where: {
          token: ctx.cookies.USER_SESSION_TOKEN,
        },
      },
    ],
  });

  if (!userModel) {
    throw new Error('user is not logged in');
  }

  if (userModel.confirmedAt) {
    throw new Error('invalid confirmation token');
  }

  if (userModel.confirmationToken !== args.input.confirmationToken) {
    throw new Error('invalid confirmation token');
  }

  userModel.confirmedAt = ctx.requestedAt;
  await userModel.save();

  return { user: toCanonicalUser(userModel) };
};
