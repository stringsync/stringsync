import { PagingType } from '@stringsync/common';

export type PagingEntity = {
  cursor: number;
};

export type PagingCtx = {
  cursor: number;
  limit: number;
  pagingType: PagingType;
};

export type EntityFinderResults<T extends PagingEntity> = {
  entities: T[];
  min: number;
  max: number;
};

export type EntityFinder<T extends PagingEntity> = (pagingCtx: PagingCtx) => Promise<EntityFinderResults<T>>;
