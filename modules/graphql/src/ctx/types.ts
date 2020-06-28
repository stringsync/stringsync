import { Container } from 'inversify';
import { Request, Response } from 'express';

export type ReqCtx = {
  req: Request;
  reqId: string;
  reqAt: Date;
  res: Response;
  container: Container;
};
