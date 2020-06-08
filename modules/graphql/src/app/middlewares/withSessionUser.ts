import { Handler, Request } from 'express';
import { Container } from 'inversify';
import { AuthService } from '@stringsync/services';
import { TYPES } from '@stringsync/container';

const getId = (req: Request): number => {
  if (!('session' in req)) {
    return 0;
  }
  if (!('user' in req.session!)) {
    return 0;
  }
  return req.session!.user.id || 0;
};

export const withSessionUser = (container: Container): Handler => async (req, res, next) => {
  const authService = container.get<AuthService>(TYPES.AuthService);
  const id = getId(req);
  req.session!.user = await authService.getSessionUser(id);
  next();
};
