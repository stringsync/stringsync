import { Request, Response, NextFunction } from 'express';
import { Prisma } from './prisma/generated/prisma-client';

export interface StringSyncRequest extends Request {
  user?: any;
}

export interface StringSyncResponse extends Response {}

export type StringSyncRequestHandler = (
  req: StringSyncRequest,
  res: StringSyncResponse,
  next: NextFunction
) => any;

export interface Context {
  prisma: Prisma;
}
