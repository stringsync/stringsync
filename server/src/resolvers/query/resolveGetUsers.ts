import { GetUserInput } from 'common/types';
import { RequestContext } from '../../request-context';
import { getUsers } from '../../db';

interface Args {
  input: GetUserInput;
}

export const resolveGetUsers = async (
  parent: undefined,
  args: Args,
  ctx: RequestContext
) => {
  return getUsers(ctx.db);
};
