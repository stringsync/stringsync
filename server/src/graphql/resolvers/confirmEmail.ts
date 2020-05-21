import { ConfirmEmailInput, ConfirmEmailOutput } from '../../common';
import { toCanonicalUser } from '../../data/db';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../util/ctx';
import { BadRequestError } from '../../common/errors/BadRequestError';

type Resolver = IFieldResolver<
  undefined,
  ResolverCtx,
  { input: ConfirmEmailInput }
>;

export const confirmEmail: Resolver = async (
  src,
  args,
  ctx
): Promise<ConfirmEmailOutput> => {
  const pk = ctx.req.session.user.id;
  const user = (await ctx.db.models.User.findByPk(pk))!;

  const isBadRequest =
    user.confirmedAt ||
    !args.input.confirmationToken ||
    user.confirmationToken !== args.input.confirmationToken;

  if (isBadRequest) {
    throw new BadRequestError('invalid confirmation token');
  }

  user.confirmedAt = ctx.reqAt;
  user.confirmationToken = null;
  await user.save();

  return { user: toCanonicalUser(user) };
};
