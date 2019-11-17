import { RequestContext } from '../../request-context';
import { getUsers } from '../../db';

interface Args {}

export const getUsersResolver = async (
  parent: undefined,
  args: Args,
  ctx: RequestContext
) => {
  return getUsers(ctx.db);
};
