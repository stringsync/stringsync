import { ReqCtx } from '../../../ctx';
import { ConfirmEmailInput, ConfirmEmailPayload } from 'common/types';
import { ForbiddenError } from 'apollo-server';

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
    throw new ForbiddenError('user is not logged in');
  }

  if (userModel.confirmedAt) {
    throw new ForbiddenError('invalid confirmation token');
  }

  if (userModel.confirmationToken !== args.input.confirmationToken) {
    throw new ForbiddenError('invalid confirmation token');
  }

  userModel.confirmedAt = ctx.requestedAt;
  await userModel.save();

  return { id: userModel.id };
};
