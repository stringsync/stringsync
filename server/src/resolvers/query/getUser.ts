import { FieldResolver } from '..';
import { GetUserInput } from 'common/types';
import { User } from 'common/types';

interface Args {
  input: GetUserInput;
}

export const getUser: FieldResolver<User | null, undefined, Args> = async (
  parent,
  args,
  ctx
) => {
  return ctx.dataLoaders.usersById.load(args.input.id);
};
