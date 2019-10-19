import { Request, Response } from 'express';
import { Db } from '../../db/createDb';
import { User } from 'common/types';
import { DataLoaders } from '../../data-loaders/createDataLoaders';

export interface Auth {
  user: User | null;
  isLoggedIn: boolean;
}

export interface RequestContext {
  req: Request;
  res: Response;
  db: Db;
  auth: Auth;
  requestedAt: Date;
  dataLoaders: DataLoaders;
}
