import { toCanonicalUser } from '../../../data/db';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../../util/ctx';
import { BadRequestError, NotFoundError } from '../../../common/errors';
import { withAuthRequirement } from '../../middlewares';
import {
  ConfirmEmailInput,
  ConfirmEmailOutput,
  compose,
  AuthRequirements,
} from '../../../common';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_IN)
);

export const resolver: IFieldResolver<
  undefined,
  ResolverCtx,
  { input: ConfirmEmailInput }
> = async (src, args, ctx): Promise<ConfirmEmailOutput> => {
  const pk = ctx.req.session.user.id;
  const user = await ctx.db.models.User.findByPk(pk);

  if (!user) {
    throw new NotFoundError('user not found');
  }
  if (user.confirmedAt) {
    throw new BadRequestError('invalid confirmation token');
  }
  if (!args.input.confirmationToken) {
    throw new BadRequestError('invalid confirmation token');
  }
  if (user.confirmationToken !== args.input.confirmationToken) {
    throw new BadRequestError('invalid confirmation token');
  }

  user.confirmedAt = ctx.reqAt;
  user.confirmationToken = null;
  await user.save();

  return { user: toCanonicalUser(user) };
};

export const confirmEmail = middleware(resolver);
