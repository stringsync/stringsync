import { Container } from '@stringsync/di';
import { AuthService, SERVICES_TYPES } from '@stringsync/services';
import { Handler } from 'express';
import { get } from 'lodash';

const TYPES = { ...SERVICES_TYPES };

export const withSessionUser = (container: Container): Handler => async (req, res, next) => {
  const authService = container.get<AuthService>(TYPES.AuthService);
  const id = get(req, 'session.user.id', '');
  (req.session as any).user = await authService.getSessionUser(id);
  next();
};
