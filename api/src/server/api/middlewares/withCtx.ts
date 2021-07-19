import { RequestHandler } from 'express';
import { Ctx } from './Ctx';

export const withCtx: RequestHandler = (req, res, next) => {
  const ctx = Ctx.bind(req);
  res.set('X-Request-ID', ctx.getReqId());
  next();
};
