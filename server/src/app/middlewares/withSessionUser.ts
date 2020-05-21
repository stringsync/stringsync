import { Middleware } from './types';
import {
  SessionUser,
  getNullSessionUser,
  toSessionUser,
} from '../../util/session';

export const withSessionUser: Middleware = (ctx) => async (req, res, next) => {
  if ('user' in req.session!) {
    const sessionUser: SessionUser = req.session!.user;
    const user = await ctx.db.models.User.findByPk(sessionUser.id);
    req.session!.user = user ? toSessionUser(user) : getNullSessionUser();
  } else {
    req.session!.user = getNullSessionUser();
  }
  next();
};
