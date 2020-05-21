import { Middleware } from './types';
import { UserModel } from '../../data/db';
import { SessionUser } from '../../util/ctx';

const getEmptySessionUser = (): SessionUser => ({
  id: '',
  role: 'student',
  isLoggedIn: false,
});

const toSessionUser = (user: UserModel) => ({
  id: user.id,
  role: user.role,
  isLoggedIn: true,
});

export const withSessionUser: Middleware = (ctx) => async (req, res, next) => {
  if ('user' in req.session!) {
    const sessionUser: SessionUser = req.session!.user;
    const user = await ctx.db.models.User.findByPk(sessionUser.id);
    req.session!.user = user ? toSessionUser(user) : getEmptySessionUser();
  } else {
    req.session!.user = getEmptySessionUser();
  }
  req.session!.save(ctx.logger.error);
  next();
};
