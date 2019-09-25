import { FieldResolver } from '..';
import { UserType, GetUserInputType } from '../schema';

interface Args {
  input: GetUserInputType;
}

export const getUser: FieldResolver<UserType, undefined, Args> = async (
  parent,
  args,
  ctx
) => {
  return ctx.dataLoaders.usersById.load(args.input.id);
};
