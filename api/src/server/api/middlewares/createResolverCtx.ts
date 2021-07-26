import { Request } from 'express';
import { ResolverCtx } from '../../../resolvers';
import { SessionUser } from '../../types';
import { Ctx } from './Ctx';

export const createResolverCtx = (req: Request): ResolverCtx => {
  // prevent memory leaks, we don't want direct references
  // to the ctx objects since they're weakly bound to the
  // req object
  const ctx = () => Ctx.get(req);
  return {
    getReqId: () => ctx().getReqId(),
    getReqAt: () => ctx().getReqAt(),
    getContainer: () => ctx().getContainer(),
    getSessionUser: () => ctx().getSessionUser(),
    setSessionUser: (sessionUser: SessionUser) => ctx().setSessionUser(req, sessionUser),
  };
};
