import { FieldResolver } from '..';
import { NotationTypeDef, UserTypeDef } from '../schema';

export const notations: FieldResolver<NotationTypeDef[], UserTypeDef> = (
  parent
) => {
  return [];
};
