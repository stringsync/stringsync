import { toCanonicalUser } from '../../data/db';
import { LogoutOutput } from '../../common/';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../util/ctx';
import { getNullSessionUser } from '../../util/session';
import { NotFoundError } from '../../common/errors/NotFoundError';

type Resolver = IFieldResolver<undefined, ResolverCtx, {}>;

export const logout: Resolver = async (
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
