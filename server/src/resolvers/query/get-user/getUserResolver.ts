import { GetUserInput } from 'common/types';
import { ReqCtx } from '../../../ctx';

interface Args {
  input: GetUserInput;
}

export const getUserResolver = async (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
) => {
  return await ctx.dataLoaders.usersById.load(args.input.id);
};
