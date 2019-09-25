import { FieldResolver } from '..';
import { NotationType, UserType } from '../types';

export const notations: FieldResolver<NotationType[], UserType> = (
  user,
  args,
  ctx
) => {
  return ctx.dataLoaders.notationsByUserId.load(user.id);
};
