import { toUser } from '../../../../data/db';
import { ResolverCtx } from '../../../../util/ctx';
import { BadRequestError, NotFoundError } from '../../../../common/errors';
import { withAuthRequirement } from '../../../middlewares';
import {
  ConfirmEmailInput,
  ConfirmEmailOutput,
  compose,
  AuthRequirements,
} from '../../../../common';
import { Resolver } from '../../../types';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_IN)
);

export const resolver: Resolver<
  Promise<ConfirmEmailOutput>,
  undefined,
  ConfirmEmailInput,
  ResolverCtx
> = async (src, args, rctx) => {
  const pk = rctx.req.session.user.id;
  const user = await rctx.db.User.findByPk(pk);

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

  user.confirmedAt = rctx.reqAt;
  user.confirmationToken = null;
  await user.save();

  return { user: toUser(user) };
};

export const confirmEmail = middleware(resolver);
