import { RequestContext } from '../../request-context';
import { toCanonicalUser } from '../../db';

interface Args {}

export const getUsersResolver = async (
  parent: undefined,
  args: Args,
  ctx: RequestContext
) => {
  const userModels = await ctx.db.models.User.findAll();
  return userModels.map(toCanonicalUser);
};
