import { Response } from 'express';
import { GlobalCtx, ResolverCtx, SessionRequest } from './types';
import { getDataLoaders } from '../../data/data-loaders';

export const createResolverCtx = (
  gctx: GlobalCtx,
  req: SessionRequest,
  res: Response,
  reqAt?: Date // used for testing
): ResolverCtx => {
  reqAt = reqAt || new Date();
  const dataLoaders = getDataLoaders(gctx.db);
  return { req, res, reqAt, dataLoaders, ...gctx };
};
