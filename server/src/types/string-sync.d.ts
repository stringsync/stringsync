import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';
import { Prisma } from './prisma/generated/prisma-client';

export namespace StringSync {
  export interface Request extends ExpressRequest {
    user?: any;
  }

  export interface Response extends ExpressResponse {}

  export type RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => any;

  export interface ResolverContext {
    req: Request;
    prisma: Prisma;
  }
}
