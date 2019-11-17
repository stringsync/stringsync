import { RequestContext } from '../../request-context';
import { getRawUsers, toCanonicalUser } from '../../db';

interface Args {}

export const getUsersResolver = async (
  parent: undefined,
  args: Args,
  ctx: RequestContext
) => {
  const rawUsers = await getRawUsers(ctx.db);
  return rawUsers.map(toCanonicalUser);
};
