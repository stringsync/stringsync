import { Db } from '../db';
import { User } from 'common/types';
import { Request, Response } from 'express';
import { getDataLoaders } from '../data-loaders';

export interface Auth {
  user: User | null;
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
