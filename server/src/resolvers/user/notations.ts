import { FieldResolver } from '..';
import { NotationType, UserType } from '../schema';

export const notations: FieldResolver<NotationType[], UserType> = (parent) => {
  return [];
};
