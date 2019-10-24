import { FieldResolver } from '..';
import { Notation } from 'common/types';
import { User } from 'common/types';

export const notations: FieldResolver<Notation[], User> = (user, args, ctx) => {
  return ctx.dataLoaders.notationsByUserId.load(user.id);
};
