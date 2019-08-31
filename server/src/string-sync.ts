import { Request, Response, NextFunction } from 'express';

export interface StringSyncRequest extends Request {
  user?: any;
}

export interface StringSyncResponse extends Response {}

export type StringSyncRequestHandler = (
  req: StringSyncRequest,
  res: StringSyncResponse,
  next: NextFunction
) => any;
