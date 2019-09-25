import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { getUserType } from './getUserType';
import { JwtPayload, JWT_SECRET, JWT_LIFESPAN_MS } from './getJwt';
import { UserType } from '../resolvers/schema';
import db from './db';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { DataLoaders, getDataLoaders } from './getDataLoaders';
import { UserModel } from '../models/UserModel';

export interface Auth {
  user?: UserType;
  isLoggedIn: boolean;
}

export interface ServerContext {
  db: typeof db;
  auth: Auth;
  requestedAt: Date;
  dataLoaders: DataLoaders;
}

export const getAuthenticatedUser = async (
  token: string,
  requestedAt: Date
) => {
  if (!token) {
    return null;
  }

  // Check jwt has been signed using JWT_SECRET
  let maybePayload: string | object;
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
    typeof maybePayload['id'] !== 'number' ||
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
  const expiresAt = new Date(payload.iat + JWT_LIFESPAN_MS);
  if (expiresAt < requestedAt || requestedAt < issuedAt) {
    return null;
  }

  // Check to see if user exists in db
  const userRecord = await UserModel.findOne({
    where: { id: payload.id },
  });
  if (!userRecord) {
    return null;
  }

  return getUserType(userRecord);
};

export const getServerContext: ContextFunction<
  ExpressContext,
  ServerContext
> = async ({ req }) => {
  const requestedAt = new Date();
  const token = req.headers.authorization || '';
  const user = await getAuthenticatedUser(token, requestedAt);
  const auth: Auth = { isLoggedIn: Boolean(user), user };
  const dataLoaders = getDataLoaders(db);

  return {
    db,
    auth,
    requestedAt,
    dataLoaders,
  };
};
