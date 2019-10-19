import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { User } from 'common/types';
import {
  DataLoaders,
  createDataLoaders,
} from '../data-loaders/createDataLoaders';
import { Request, Response } from 'express';
import { Db } from '../db/createDb';
import { getUserSessionToken } from '../modules/user-session-token';

export interface Auth {
  user: User | null;
  isLoggedIn: boolean;
  token: string;
}

export interface ServerContext {
  req: Request;
  res: Response;
  db: Db;
  auth: Auth;
  requestedAt: Date;
  dataLoaders: DataLoaders;
}

export const getAuthenticatedUser = async (
  token: string,
  requestedAt: Date,
  db: Db
): Promise<User | null> => {
  if (!token) {
    return null;
  }
  const session = await db.models.UserSession.findOne({
    where: { token },
    include: [{ model: db.models.User }],
  });
  if (!session) {
    return null;
  }
  if (session.expiresAt < requestedAt) {
    return null;
  }
  return session.get('user', { plain: true }) as User | null;
};

export const getServerContextCreator = (
  db: Db
): ContextFunction<ExpressContext, ServerContext> => async ({ req, res }) => {
  const requestedAt = new Date();
  const dataLoaders = createDataLoaders(db);
  const token = getUserSessionToken(req);
  const user = await getAuthenticatedUser(token, requestedAt, db);
  const auth: Auth = { isLoggedIn: Boolean(user), user, token };

  return {
    req,
    res,
    db,
    auth,
    requestedAt,
    dataLoaders,
  };
};
