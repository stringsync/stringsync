import { Container } from 'inversify';
import { SessionUser } from '../../server';

export type ResolverCtx = {
  getReqId(): string;
  getReqAt(): Date;
  getContainer(): Container;
  getSessionUser(): SessionUser;
  setSessionUser(sessionUser: SessionUser): void;
};
