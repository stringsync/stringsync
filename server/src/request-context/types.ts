import { Db } from '../db';
import { User } from 'common/types';
import { DataLoaders } from '../data-loaders/createDataLoaders';
import { Request, Response } from 'express';

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
  dataLoaders: DataLoaders;
  db: Db;
  req: Request;
  requestedAt: Date;
  res: Response;
}
