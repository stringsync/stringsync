import { Handler } from 'express';
import { Container } from 'inversify';
import { get } from 'lodash';
import { TYPES } from '../../inversify.constants';
import { AuthService } from '../../services';

export const withSessionUser = (container: Container): Handler => async (req, res, next) => {
  const authService = container.get<AuthService>(TYPES.AuthService);
  const id = get(req, 'session.user.id', '');

  try {
    (req as any).session.user = await authService.getSessionUser(id);
  } catch (e) {
    next(e);
  }

  next();
};
