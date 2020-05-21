import { Request, Response } from 'express';
import { GlobalCtx, ResolverCtx, SessionRequest } from './types';
import { getDataLoaders } from '../../data/data-loaders';

export const createResolverCtx = (
  ctx: GlobalCtx,
  req: Request,
  res: Response
): ResolverCtx => {
  const reqAt = new Date();
  const dataLoaders = getDataLoaders(ctx.db);
  return {
    req: req as SessionRequest,
    res,
    reqAt,
    dataLoaders,
    ...ctx,
  };
};
