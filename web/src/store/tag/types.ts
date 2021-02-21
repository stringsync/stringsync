import { Tag } from '../../domain';

export type TagState = {
  isPending: boolean;
  tags: Tag[];
  errors: string[];
};

export type TagReducers = {};
