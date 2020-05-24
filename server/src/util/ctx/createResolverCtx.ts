import { Response } from 'express';
import { GlobalCtx, ResolverCtx, SessionRequest } from './types';
import { getDataLoaders } from '../../data/data-loaders';

export const createResolverCtx = (
  ctx: GlobalCtx,
  req: SessionRequest,
  res: Response,
  reqAt?: Date // used for testing
): ResolverCtx => {
  reqAt = reqAt || new Date();
  const dataLoaders = getDataLoaders(ctx.db);
  return { req, res, reqAt, dataLoaders, ...ctx };
};
