import { toCanonicalUser } from '../../../data/db';
import { LogoutOutput, compose, AuthRequirements } from '../../../common/';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../../util/ctx';
import { getNullSessionUser } from '../../../util/session';
import { NotFoundError } from '../../../common/errors';
import { withAuthRequirement } from '../../middlewares';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_IN)
);

export const resolver: IFieldResolver<undefined, ResolverCtx, {}> = async (
  src,
  args,
  ctx
): Promise<LogoutOutput> => {
  const pk = ctx.req.session.user.id;
  const user = await ctx.db.models.User.findByPk(pk);

  if (!user) {
    throw new NotFoundError('user not found');
  }

  ctx.req.session.user = getNullSessionUser();

  return { user: toCanonicalUser(user) };
};

export const logout = middleware(resolver);
