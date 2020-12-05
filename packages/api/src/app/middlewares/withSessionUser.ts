import { TYPES } from '@stringsync/di';
import { AuthService } from '@stringsync/services';
import { Handler } from 'express';
import { interfaces } from 'inversify';
import { get } from 'lodash';

export const withSessionUser = (container: interfaces.Container): Handler => async (req, res, next) => {
  const authService = container.get<AuthService>(TYPES.AuthService);
  const id = get(req, 'session.user.id', '');
  (req.session as any).user = await authService.getSessionUser(id);
  next();
};
