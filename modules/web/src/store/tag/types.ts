import { Tag } from '@stringsync/domain';

export type TagState = {
  isPending: boolean;
  tags: Tag[];
  errors: string[];
};

export type TagReducers = {};
