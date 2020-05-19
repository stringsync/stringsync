import { GetUserInput, User } from '../../../common';
import { Resolver } from '../../types';

interface Args {
  input: GetUserInput;
}

type GetUser = Resolver<Promise<User | null>, undefined, Args>;

export const getUser: GetUser = async (parent, args, ctx) => {
  return await ctx.dataLoaders.usersById.load(args.input.id);
};
