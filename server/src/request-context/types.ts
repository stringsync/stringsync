import { Db, RawUser } from '../db';
import { Request, Response } from 'express';
import { getDataLoaders } from '../data-loaders';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

export interface Auth {
  user: RawUser | null;
  isLoggedIn: boolean;
  token: string;
}

export interface Cookies {
  USER_SESSION_TOKEN: string;
}

export interface RequestContext {
  auth: Auth;
  cookies: Cookies;
  dataLoaders: ReturnType<typeof getDataLoaders>;
  db: Db;
  req: Request;
  requestedAt: Date;
  res: Response;
}

export type RequestContextCreator = ContextFunction<
  ExpressContext,
  RequestContext
>;
