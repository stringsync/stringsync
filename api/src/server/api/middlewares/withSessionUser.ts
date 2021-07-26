import { Handler } from 'express';
import { get } from 'lodash';
import { AuthService } from '../../../services';
import { Ctx } from './Ctx';

export const withSessionUser = (authService: AuthService): Handler => async (req, res, next) => {
  const id = get(req, 'session.user.id', ''); // set by express-session

  try {
    const sessionUser = await authService.getSessionUser(id);
    const ctx = Ctx.get(req);
    ctx.setSessionUser(req, sessionUser);
  } catch (err) {
    console.error(err);
    next(err);
  }

  next();
};
