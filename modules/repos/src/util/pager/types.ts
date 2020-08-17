import { PagingType } from '@stringsync/common';

export type PagingEntity = {
  cursor: number;
};

export type PagingCtx = {
  cursor: number;
  limit: number;
  pagingType: PagingType;
};

export type PageFinder<T> = (pagingCtx: PagingCtx) => Promise<T[]>;
