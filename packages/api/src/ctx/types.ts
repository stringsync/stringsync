import { Container } from '@stringsync/di';
import { SessionUser } from '@stringsync/services';
import { Request, Response } from 'express';

export type SessionRequest = Request & {
  session: { user: SessionUser };
  sessionID: string;
};

export type ReqCtx = {
  req: SessionRequest;
  reqId: string;
  reqAt: Date;
  res: Response;
  container: Container;
};
