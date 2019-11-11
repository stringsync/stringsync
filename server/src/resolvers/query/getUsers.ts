import { guardAuthenticated } from '../../guards';
import { toUserPojo } from '../../db';
import { RequestContext } from '../../request-context';

interface Args {}

export const getUsers = async (
  parent: undefined,
  args: Args,
  ctx: RequestContext
) => {
  guardAuthenticated(ctx);
  return (await ctx.db.models.User.findAll({ raw: true })).map(toUserPojo);
};
