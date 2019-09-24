import { FieldResolver } from '..';
import { NotationTypeDef, UserType } from '../schema';

export const notations: FieldResolver<NotationTypeDef[], UserType> = (
  parent
) => {
  return [];
};
