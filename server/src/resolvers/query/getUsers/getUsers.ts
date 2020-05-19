import { toCanonicalUser } from '../../../data/db';
import { Resolver } from '../../types';
import { User } from '../../../common';

interface Args {}

type GetUsers = Resolver<Promise<Array<User | null>>, undefined, Args>;

export const getUsers: GetUsers = async (parent, args, ctx) => {
  const userModels = await ctx.db.models.User.findAll();
  return userModels.map(toCanonicalUser);
};
