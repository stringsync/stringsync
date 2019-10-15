import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { asUserPojo } from '../db/casters/user/asUserPojo';
import { JwtPayload } from './auth-jwt/createAuthJwt';
import { JWT_COOKIE_NAME, JWT_SECRET, JWT_MAX_AGE_MS } from './auth-jwt';
import { User } from 'common/types';
import jwt from 'jsonwebtoken';
import {
  DataLoaders,
  createDataLoaders,
} from '../data-loaders/createDataLoaders';
import { Request, Response } from 'express';
import { Db } from '../db/createDb';

export interface Auth {
  user: User | null;
  isLoggedIn: boolean;
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

  // Check jwt has been signed using JWT_SECRET
  let maybePayload: string | { [key: string]: any };
  try {
    maybePayload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // if we come across an error trying to verify the token,
    // log the error and return null
    console.error(err);
    return null;
  }
  if (
    typeof maybePayload === 'string' ||
    typeof maybePayload['id'] !== 'string' ||
    typeof maybePayload['iat'] !== 'number'
  ) {
    return null;
  }
  const payload: JwtPayload = {
    id: maybePayload['id'],
    iat: maybePayload['iat'],
  };

  // Check that jwt is not expired and that it was not issued in the future
  const issuedAt = new Date(payload.iat);
  const expiresAt = new Date(payload.iat + JWT_MAX_AGE_MS);
  if (expiresAt < requestedAt || requestedAt < issuedAt) {
    return null;
  }

  // Check to see if user exists in db
  return await db.models.User.findOne({
    where: { id: payload.id },
    ...asUserPojo,
  });
};

export const createServerContext = (
  db: Db
): ContextFunction<ExpressContext, ServerContext> => async ({ req, res }) => {
  const requestedAt = new Date();
  const token = req.cookies[JWT_COOKIE_NAME] || '';
  const user = await getAuthenticatedUser(token, requestedAt, db);
  const auth: Auth = { isLoggedIn: Boolean(user), user };
  const dataLoaders = createDataLoaders(db);

  return {
    req,
    res,
    db,
    auth,
    requestedAt,
    dataLoaders,
  };
};
