import { RequestHandler } from 'express';
import { Ctx } from './Ctx';

export const withCtx: RequestHandler = (req, res, next) => {
  Ctx.bind(req);
  next();
};
