import { toCanonicalUser } from '../../data/db';
import { LogoutOutput } from '../../common/';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../util/ctx';
import { getNullSessionUser } from '../../util/session';

type Resolver = IFieldResolver<undefined, ResolverCtx, {}>;

export const logout: Resolver = async (
  src,
  args,
  ctx
): Promise<LogoutOutput> => {
  const pk = ctx.req.session.user.id;
  const user = (await ctx.db.models.User.findByPk(pk))!;

  ctx.req.session.user = getNullSessionUser();

  return { user: toCanonicalUser(user) };
};
