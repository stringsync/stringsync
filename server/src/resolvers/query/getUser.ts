import { GetUserInput } from 'common/types';
import { RequestContext } from '../../request-context';

interface Args {
  input: GetUserInput;
}

export const getUser = async (
  parent: undefined,
  args: Args,
  ctx: RequestContext
) => {
  return await ctx.dataLoaders.usersById.load(args.input.id);
};
