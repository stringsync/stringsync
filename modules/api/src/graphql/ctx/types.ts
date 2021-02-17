import { Request, Response } from 'express';
import { Container } from 'inversify';

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
