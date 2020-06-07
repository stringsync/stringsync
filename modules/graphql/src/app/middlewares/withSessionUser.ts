import { SessionUser, getNullSessionUser, toSessionUser } from '../session';
import { Handler } from 'express';
import { Container } from 'inversify';
import { UserRepo } from '@stringsync/repos';
import { TYPES } from '@stringsync/container';

export const withSessionUser = (container: Container): Handler => async (req, res, next) => {
  if ('user' in req.session!) {
    const userRepo = container.get<UserRepo>(TYPES.UserRepo);
    const sessionUser: SessionUser = req.session!.user;
    const user = await userRepo.find(sessionUser.id);
    req.session!.user = user ? toSessionUser(user) : getNullSessionUser();
  } else {
    req.session!.user = getNullSessionUser();
  }
  next();
};
