import { Container } from 'inversify';
import { Request, Response } from 'express';
import { SessionUser } from '@stringsync/services';

export type SessionRequest = Request & {
  session: Express.Session & { user: SessionUser };
  sessionID: string;
};

export type ReqCtx = {
  req: SessionRequest;
  reqId: string;
  reqAt: Date;
  res: Response;
  container: Container;
};
