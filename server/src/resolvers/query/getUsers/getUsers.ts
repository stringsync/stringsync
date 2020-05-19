import { ReqCtx } from '../../../util/ctx';
import { toCanonicalUser } from '../../../data/db';

interface Args {}

export const getUsers = async (parent: undefined, args: Args, ctx: ReqCtx) => {
  const userModels = await ctx.db.models.User.findAll();
  return userModels.map(toCanonicalUser);
};
