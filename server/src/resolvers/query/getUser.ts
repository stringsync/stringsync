import { FieldResolver } from '..';
import { GetUserInputType } from '../types';
import { User } from 'common/types';

interface Args {
  input: GetUserInputType;
}

export const getUser: FieldResolver<User, undefined, Args> = async (
  parent,
  args,
  ctx
) => {
  return ctx.dataLoaders.usersById.load(args.input.id);
};
