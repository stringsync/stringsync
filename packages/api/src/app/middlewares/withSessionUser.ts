import { Container } from '@stringsync/di';
import { AuthService, SERVICES_TYPES } from '@stringsync/services';
import { Handler } from 'express';
import { get } from 'lodash';

const TYPES = { ...SERVICES_TYPES };

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
