import { Request, Response } from 'express';
import { Container } from 'inversify';
import { UserRole } from '../domain';

export type SessionUser = {
  id: string;
  role: UserRole;
  isLoggedIn: boolean;
};

export type SessionRequest = Request & {
  session: { user: SessionUser };
  sessionID: string;
};

export type ReqCtx = {
  req: SessionRequest;
  reqAt: Date;
  res: Response;
  container: Container;
};
