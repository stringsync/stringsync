import { Response } from 'express';
import { SessionUser } from '@stringsync/services';

export type SessionRequest = Request & {
  session: Express.Session & { user: SessionUser };
  sessionID: string;
};

export interface ResolverCtx {
  req: SessionRequest;
  res: Response;
  reqAt: Date;
}
