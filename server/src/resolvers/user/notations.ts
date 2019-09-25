import { FieldResolver } from '..';
import { NotationType, UserType } from '../schema';

export const notations: FieldResolver<NotationType[], UserType> = (
  user,
  args,
  ctx
) => {
  return ctx.dataLoaders.notationsByUserId.load(user.id);
};
