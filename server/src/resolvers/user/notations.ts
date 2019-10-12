import { FieldResolver } from '..';
import { NotationType } from '../types';
import { User } from 'common/types';

export const notations: FieldResolver<NotationType[], User> = (
  user,
  args,
  ctx
) => {
  return ctx.dataLoaders.notationsByUserId.load(user.id);
};
