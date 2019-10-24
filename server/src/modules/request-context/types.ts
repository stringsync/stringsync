import { Request, Response } from 'express';
import { Db } from '../../db/createDb';
import { User } from 'common/types';
import { DataLoaders } from '../../modules/data-loaders/createDataLoaders';

export interface Auth {
  user: User | null;
  isLoggedIn: boolean;
  token: string;
}

export interface Cookies {
  USER_SESSION_TOKEN: string;
}

export interface RequestContext {
  requestedAt: Date;
  req: Request;
  res: Response;
  cookies: Cookies;
  auth: Auth;
  dataLoaders: DataLoaders;
  db: Db;
}
