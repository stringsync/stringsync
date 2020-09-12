import { Handler } from 'express';
import { Container } from 'inversify';
import { AuthService } from '@stringsync/services';
import { TYPES } from '@stringsync/di';
import { get } from 'lodash';

export const withSessionUser = (container: Container): Handler => async (req, res, next) => {
  const authService = container.get<AuthService>(TYPES.AuthService);
  const id = get(req, 'session.user.id', '');
  req.session!.user = await authService.getSessionUser(id);
  next();
};
