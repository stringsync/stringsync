import { ConfirmEmailInput, ConfirmEmailOutput } from '../../common';
import { toCanonicalUser } from '../../data/db';
import { IFieldResolver } from 'graphql-tools';
import { GraphQLCtx } from '../../util/ctx';

type ConfirmEmailResolver = IFieldResolver<
  undefined,
  GraphQLCtx,
  { input: ConfirmEmailInput }
>;

export const confirmEmail: ConfirmEmailResolver = async (
  src,
  args,
  ctx
): Promise<ConfirmEmailOutput> => {
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

  userModel.confirmedAt = ctx.reqAt;
  await userModel.save();

  return { user: toCanonicalUser(userModel) };
};
