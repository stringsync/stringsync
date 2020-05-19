import { GetUserInput } from '../../../common/types';
import { ReqCtx } from '../../../util/ctx';

interface Args {
  input: GetUserInput;
}

export const getUser = async (parent: undefined, args: Args, ctx: ReqCtx) => {
  return await ctx.dataLoaders.usersById.load(args.input.id);
};
