import { Middleware } from './types';
import {
  SessionUser,
  getNullSessionUser,
  toSessionUser,
} from '../../util/session';
import { Handler } from 'express';
import { GlobalCtx } from '../../util/ctx';

export const withSessionUser = (gctx: GlobalCtx): Handler => async (
  req,
  res,
  next
) => {
  if ('user' in req.session!) {
    const sessionUser: SessionUser = req.session!.user;
    const user = await gctx.db.User.findByPk(sessionUser.id);
    req.session!.user = user ? toSessionUser(user) : getNullSessionUser();
  } else {
    req.session!.user = getNullSessionUser();
  }
  next();
};
